/* ==========================================================
   GOOGLE SHEETS — Registrar doações em tempo real
   ========================================================== */

const { GoogleSpreadsheet } = require('google-spreadsheet');

let doc;
let sheet;

/**
 * Inicializa conexão com Google Sheets
 */
async function inicializarGoogleSheets() {
  try {
    if (!process.env.GOOGLE_SHEET_ID) {
      console.log('⚠️ Google Sheets não configurado');
      return false;
    }

    doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    // Autenticar com credenciais de serviço
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    });

    await doc.loadInfo();

    // Pegar primeira planilha ou criar uma nova
    sheet = doc.sheetsByIndex[0];
    if (!sheet) {
      sheet = await doc.addSheet({ title: 'Doações' });
      await sheet.setHeaderRow([
        'ID Transação',
        'Nome',
        'Email',
        'CPF/Documento',
        'Telefone',
        'Valor (R$)',
        'Método',
        'Status',
        'Data Confirmação',
        'Data Registro'
      ]);
    }

    console.log('✅ Google Sheets conectado');
    return true;

  } catch (erro) {
    console.error('❌ Erro ao conectar Google Sheets:', erro.message);
    return false;
  }
}

/**
 * Registra uma doação na planilha
 */
async function registrarEmGoogleSheets(dados) {
  try {
    // Inicializar se necessário
    if (!sheet) {
      const conectado = await inicializarGoogleSheets();
      if (!conectado) return;
    }

    // Adicionar linha à planilha
    await sheet.addRows([{
      'ID Transação': dados.transactionId,
      'Nome': dados.nome || 'Anônimo',
      'Email': dados.email || '-',
      'CPF/Documento': dados.documento || '-',
      'Telefone': dados.telefone || '-',
      'Valor (R$)': dados.valor,
      'Método': dados.metodo?.toUpperCase() || 'PIX',
      'Status': dados.status,
      'Data Confirmação': dados.dataConfirmacao || new Date().toISOString(),
      'Data Registro': new Date().toLocaleString('pt-BR')
    }]);

    console.log('📊 Doação registrada em Google Sheets:', dados.transactionId);

  } catch (erro) {
    console.error('❌ Erro ao registrar em Google Sheets:', erro.message);
  }
}

/**
 * Obtém todas as doações confirmadas
 */
async function obterDoacoesConfirmadas() {
  try {
    if (!sheet) {
      await inicializarGoogleSheets();
    }

    const rows = await sheet.getRows();
    return rows
      .filter(row => row['Status'] === 'CONFIRMADO')
      .map(row => ({
        transactionId: row['ID Transação'],
        nome: row['Nome'],
        email: row['Email'],
        valor: parseFloat(row['Valor (R$)']),
        metodo: row['Método'],
        dataConfirmacao: row['Data Confirmação']
      }));

  } catch (erro) {
    console.error('❌ Erro ao obter doações:', erro.message);
    return [];
  }
}

/**
 * Obtém estatísticas da campanha
 */
async function obterEstatisticas() {
  try {
    if (!sheet) {
      await inicializarGoogleSheets();
    }

    const rows = await sheet.getRows();
    const confirmadas = rows.filter(row => row['Status'] === 'CONFIRMADO');

    const total = confirmadas.reduce((acc, row) => {
      return acc + (parseFloat(row['Valor (R$)']) || 0);
    }, 0);

    return {
      arrecadado: total,
      doadores: confirmadas.length,
      meta: 100000,
      percentual: ((total / 100000) * 100).toFixed(2)
    };

  } catch (erro) {
    console.error('❌ Erro ao calcular estatísticas:', erro.message);
    return {
      arrecadado: 0,
      doadores: 0,
      meta: 100000,
      percentual: 0
    };
  }
}

module.exports = {
  registrarEmGoogleSheets,
  obterDoacoesConfirmadas,
  obterEstatisticas,
  inicializarGoogleSheets
};
