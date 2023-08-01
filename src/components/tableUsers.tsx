import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid'
import axios from 'axios'
import Dashboard from '@/app/dashboard/page'

const storedToken = localStorage.getItem('@TOKEN')
const token = storedToken ?? 'null'

function handleDeleteContato(contactId: string) {
  axios
    .delete(`http://localhost:3000/schedule/${contactId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((error) => {
      console.error('Erro ao deletar contato:', error)
    })
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 250 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'phone', headerName: 'Phone', width: 200 },
  {
    field: 'Edit',
    headerName: 'Edit',
    width: 100,
    renderCell: (params: GridCellParams) => (
      <button className="bg-yellow-400 w-[100%]">Edit</button>
    ),
  },
  {
    field: 'Remove',
    headerName: 'Remove',
    width: 100,
    renderCell: (params: GridCellParams) => (
      <button
        className="bg-red-400 w-[100%]"
        onClick={() => handleDeleteContato(params.row.id)}
      >
        Remove
      </button>
    ),
  },
]

interface IUser {
  name: string
  email: string
  phone: string
  id: string
}

interface DataTableProps {
  users: IUser[]
  handleContactDelete: () => void
}

export default function DataTable({ users }: DataTableProps) {
  return (
    <div style={{ height: 400, width: '100%' }}>
      {users.length === 0 ? (
        <h1 className="block text-sm font-medium leading-6 text-gray-900">
          You haven't created any contacts yet :(
        </h1>
      ) : (
        <DataGrid rows={users} columns={columns} checkboxSelection />
      )}
    </div>
  )
}
