import type { jsPDF } from 'jspdf'

type JsPdfWithAutoTable = jsPDF & {
  lastAutoTable: {
    finalY: number
  }
}

export function getLastAutoTableFinalY(doc: jsPDF): number {
  return (doc as JsPdfWithAutoTable).lastAutoTable.finalY
}

export function toTableRow(values: readonly string[]): string[] {
  return [...values]
}
