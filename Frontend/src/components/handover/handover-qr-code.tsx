import { QRCodeSVG } from 'qrcode.react'

type HandoverQrCodeProps = {
  value: string
}

export function HandoverQrCode({ value }: HandoverQrCodeProps) {
  return (
    <div className="flex justify-center">
      <QRCodeSVG
        value={value}
        size={168}
        level="M"
        marginSize={2}
        className="rounded-md"
        aria-label="Handover QR code"
        role="img"
      />
    </div>
  )
}
