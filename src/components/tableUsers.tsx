import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid'

const handleEdit = (id: number | string) => {
  console.log('Editar usuário com ID:', id)
}

const handleRemove = (id: number | string) => {
  console.log('Remover usuário com ID:', id)
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Nome do contato', width: 250 },
  { field: 'email', headerName: 'Email do contato', width: 250 },
  { field: 'phone', headerName: 'Telefone do contato', width: 200 },
  {
    field: 'editar',
    headerName: 'Editar',
    width: 100,
    renderCell: (params: GridCellParams) => (
      <button
        className="bg-yellow-400 w-[100%]"
        onClick={() => handleEdit(params.row.id)}
      >
        Editar
      </button>
    ),
  },
  {
    field: 'remover',
    headerName: 'Remover',
    width: 100,
    renderCell: (params: GridCellParams) => (
      <button
        className="bg-red-400 w-[100%]"
        onClick={() => handleRemove(params.row.id)}
      >
        Excluir
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

export default function DataTable({ users }: { users: IUser[] }) {
  return (
    <div style={{ height: 400, width: '100%' }}>
      {users.length === 0 ? (
        <h1>Sem contatos</h1>
      ) : (
        <DataGrid rows={users} columns={columns} checkboxSelection />
      )}
    </div>
  )
}
