import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Eye, FileEdit } from 'lucide-react'

const mockPatients = [
  {
    id: 1,
    name: 'Esther Howard',
    email: 'esther@example.com',
    gender: 'female',
    phone: '+1 234 567 890',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Brooklyn Simmons',
    email: 'brooklyn@example.com',
    gender: 'male',
    phone: '+1 987 654 321',
    status: 'Inactive',
  },
]

export default function Patients() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Patient Management</h2>
        <Button>Add New Patient</Button>
      </div>

      <Card className="shadow-subtle border-none rounded-2xl">
        <CardHeader>
          <CardTitle>All Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://img.usecurling.com/ppl/thumbnail?gender=${patient.gender}&seed=${patient.id}`}
                        />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">{patient.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${patient.status === 'Active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}
                    >
                      {patient.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <FileEdit className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
