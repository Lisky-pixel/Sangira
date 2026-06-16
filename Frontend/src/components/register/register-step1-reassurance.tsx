import { Shield, ShieldCheck } from 'lucide-react'
import { registerStep1Content } from '../../placeholder/register-content'
import { cn } from '../../lib/utils'

const reassuranceIcons = {
  shield: Shield,
  'shield-check': ShieldCheck,
} as const

type RegisterStep1ReassuranceProps = {
  className?: string
}

export function RegisterStep1Reassurance({
  className,
}: RegisterStep1ReassuranceProps) {
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:gap-8', className)}>
      {registerStep1Content.reassurance.map((item) => {
        const Icon = reassuranceIcons[item.icon]

        return (
          <div
            key={item.text}
            className="text-body flex flex-1 items-start gap-2 text-sm"
          >
            <Icon
              aria-hidden="true"
              className="text-status-neutral mt-0.5 size-4 shrink-0"
            />
            <p>{item.text}</p>
          </div>
        )
      })}
    </div>
  )
}
