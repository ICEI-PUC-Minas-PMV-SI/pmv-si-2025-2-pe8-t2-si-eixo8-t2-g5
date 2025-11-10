const db = require('../config/db');
const PDFDocument = require('pdfkit');

exports.getDashboardData = async (req, res) => {
  const usuarioId = req.user.id;

  try {
    const historicoQuery = `
      SELECT id, TO_CHAR(data, 'YYYY-MM-DD') as data, servico, profissional, preco 
      FROM historico_servicos
      WHERE usuario_id = $1
      ORDER BY data DESC
    `;
    const historicoResult = await db.query(historicoQuery, [usuarioId]);

    const statsQuery = `
      SELECT COUNT(*) AS totalMes
      FROM historico_servicos
      WHERE usuario_id = $1
        AND EXTRACT(MONTH FROM data) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM data) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;
    const statsResult = await db.query(statsQuery, [usuarioId]);

    res.status(200).json({
      historico: historicoResult.rows,
      totalMes: parseInt(statsResult.rows[0].totalmes, 10)
    });

  } catch (err) {
    console.error('Erro ao buscar dados do dashboard:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.gerarRelatorioPDF = async (req, res) => {
  const usuarioId = req.user.id;
  
  try {
    const userRes = await db.query('SELECT nome, email FROM usuarios WHERE id = $1', [usuarioId]);
    const historicoRes = await db.query(`
      SELECT TO_CHAR(data, 'DD/MM/YYYY') as data, servico, profissional, preco 
      FROM historico_servicos
      WHERE usuario_id = $1
      ORDER BY data DESC
    `, [usuarioId]);

    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const user = userRes.rows[0];
    const historico = historicoRes.rows;

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio-servicos.pdf');

    doc.pipe(res);

    doc.fontSize(18).font('Helvetica-Bold').text('Relatório de Histórico de Serviços', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12).font('Helvetica-Bold').text('Cliente:');
    doc.font('Helvetica').text(`${user.nome} (ID: ${usuarioId})`);
    doc.text(`Email: ${user.email}`);
    doc.moveDown();
    doc.fontSize(10).text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}`);
    doc.moveDown(2);

    const tabelaItens = {
      headers: ['Data', 'Serviço', 'Profissional', 'Preço (R$)'],
      rows: historico.map(item => [
        item.data,
        item.servico,
        item.profissional,
        parseFloat(item.preco).toFixed(2)
      ])
    };

    gerarTabelaPDF(doc, tabelaItens);

    const totalGasto = historico.reduce((acc, item) => acc + parseFloat(item.preco), 0);
    doc.moveDown();
    doc.fontSize(14).font('Helvetica-Bold').text(`Total Gasto: R$ ${totalGasto.toFixed(2)}`, { align: 'right' });

    doc.end();

  } catch (err) {
    console.error('Erro ao gerar PDF:', err);
    res.status(500).json({ message: 'Erro ao gerar relatório PDF.' });
  }
};

function gerarTabelaPDF(doc, tabela) {
  let yPos = doc.y;
  const xPos = doc.x;
  const colWidth = 125;
  const headerHeight = 25;
  const rowHeight = 25;

  doc.font('Helvetica-Bold');
  tabela.headers.forEach((header, i) => {
    doc.rect(xPos + (i * colWidth), yPos, colWidth, headerHeight).stroke();
    doc.text(header, xPos + (i * colWidth) + 5, yPos + 5, { width: colWidth - 10, align: 'left' });
  });

  yPos += headerHeight;
  doc.font('Helvetica');

  tabela.rows.forEach(row => {
    if (yPos + rowHeight > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      yPos = doc.page.margins.top;

      doc.font('Helvetica-Bold');
      tabela.headers.forEach((header, i) => {
        doc.rect(xPos + (i * colWidth), yPos, colWidth, headerHeight).stroke();
        doc.text(header, xPos + (i * colWidth) + 5, yPos + 5, { width: colWidth - 10, align: 'left' });
      });
      yPos += headerHeight;
      doc.font('Helvetica');
    }

    row.forEach((cell, i) => {
      doc.rect(xPos + (i * colWidth), yPos, colWidth, rowHeight).stroke();
      const align = (i === tabela.headers.length - 1) ? 'right' : 'left';
      doc.text(cell, xPos + (i * colWidth) + 5, yPos + 5, { width: colWidth - 10, align: align });
    });
    yPos += rowHeight;
  });
}
