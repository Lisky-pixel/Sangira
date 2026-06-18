import { donorHandoverContent } from '../../placeholder/donor-handover-content'

type DonorHandoverWaitingProps = {
  ngoName: string
}

export function DonorHandoverWaiting({ ngoName }: DonorHandoverWaitingProps) {
  return (
    <div className="relative mt-6">
      <div
        aria-hidden="true"
        className="bg-border absolute top-0 left-1/2 h-6 w-px -translate-x-1/2 -translate-y-full"
      />
      <div className="border-border rounded-xl border border-dashed bg-[#f5f0e8] px-5 py-6 text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-amber-500"
          />
          {donorHandoverContent.waiting.pill}
        </p>
        <p className="text-body mt-4 text-sm">
          {donorHandoverContent.waiting.message(ngoName)}
        </p>
        <div
          aria-hidden="true"
          className="mt-5 flex items-center justify-center gap-1.5"
        >
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="bg-primary size-2 animate-pulse rounded-full"
              style={{ animationDelay: `${index * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
