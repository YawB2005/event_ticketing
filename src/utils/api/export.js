function escapeCsv(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

export function toCsv(rows, columns) {
  const header = columns.map((col) => escapeCsv(col.label)).join(',')
  const body = rows
    .map((row) => columns.map((col) => escapeCsv(row[col.key])).join(','))
    .join('\n')
  return `${header}\n${body}`
}

export function csvResponse(filename, content) {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

/** Minimal single-page PDF with plain-text lines (no external deps). */
export function toSimplePdf(lines) {
  const sanitized = lines.map((line) =>
    String(line ?? '')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
  )

  let y = 750
  const textOps = sanitized
    .map((line) => {
      const op = `BT /F1 11 Tf 50 ${y} Td (${line}) Tj ET`
      y -= 16
      return op
    })
    .join('\n')

  const stream = `${textOps}\n`
  const streamLength = Buffer.byteLength(stream, 'utf8')

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${stream}endstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = [0]

  objects.forEach((obj) => {
    offsets.push(Buffer.byteLength(pdf, 'utf8'))
    pdf += obj
  })

  const xrefOffset = Buffer.byteLength(pdf, 'utf8')
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`
  pdf += `startxref\n${xrefOffset}\n%%EOF`

  return pdf
}

export function pdfResponse(filename, content) {
  return new Response(content, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
