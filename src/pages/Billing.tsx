import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Basic Clinic',
    price: '$99',
    description: 'Perfect for small individual practices.',
    features: ['Up to 500 patients', 'Basic reporting', 'Email support', '1 Doctor account'],
  },
  {
    name: 'Pro Hospital',
    price: '$299',
    description: 'Advanced features for growing hospitals.',
    features: [
      'Unlimited patients',
      'Advanced Analytics',
      '24/7 Priority support',
      'Up to 10 Doctor accounts',
      'Custom Integrations',
    ],
    popular: true,
  },
]

export default function Billing() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Billing & Plans</h2>
        <p className="text-muted-foreground mt-1">Manage your clinic's subscription tier.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative rounded-2xl shadow-subtle ${plan.popular ? 'border-primary ring-1 ring-primary' : 'border-none'}`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mt-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="size-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-8" variant={plan.popular ? 'default' : 'outline'}>
                {plan.popular ? 'Upgrade Plan' : 'Current Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
