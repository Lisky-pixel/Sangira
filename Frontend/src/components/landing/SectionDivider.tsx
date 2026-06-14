export function SectionDivider() {
  return (
    <div
      className="h-3 w-full bg-sangira-green"
      style={{
        WebkitMaskImage: 'url(/images/section-divider.png)',
        maskImage: 'url(/images/section-divider.png)',
        WebkitMaskRepeat: 'repeat-x',
        maskRepeat: 'repeat-x',
        WebkitMaskSize: 'auto 100%',
        maskSize: 'auto 100%',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
      aria-hidden="true"
    />
  )
}
