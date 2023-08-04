import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid'
import axios from 'axios'
import { Dispatch, SetStateAction, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Modal } from '@mui/base'
import { UsersIcon } from '@heroicons/react/24/outline'
import { useStyleRegistry } from 'styled-jsx'
import { userAgentFromString } from 'next/server'
const storedToken = localStorage.getItem('@TOKEN')
const token = storedToken ?? 'null'

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 10,
  borderRadius: '8px',
  color: 'black',
}

interface IUser {
  name: string
  email: string
  phone: string
  id: string
}

interface DataTableProps {
  users: IUser[]
  handleContactDelete: () => void
  setUsers: Dispatch<SetStateAction<IUser[]>>
}

interface UpdatedUserData {
  name: string
  email: string
  phone: string
}

export default function DataTable({
  users,
  setUsers,
}: {
  users: IUser[]
  setUsers: Dispatch<SetStateAction<IUser[]>>
}) {
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  const [editingUserId, setEditingUserId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const storedToken = localStorage.getItem('@TOKEN')
  const token = storedToken ?? 'null'

  function handleDeleteContato(id: string) {
    axios
      .delete(`http://localhost:3000/schedule/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        const updatedUsers = users.filter((user) => user.id !== id)
        setUsers(updatedUsers)
      })
      .catch((error) => {
        console.error('Erro ao deletar contato:', error)
      })
  }

  const handleSaveEdit = () => {
    const updatedUserData: UpdatedUserData = {
      name,
      email,
      phone,
    }

    handleEdit(editingUserId, updatedUserData)
    handleEditModalClose()
  }

  const handleEditModalOpen = (user: IUser) => {
    setEditingUserId(user.id)
    setName(user.name)
    setEmail(user.email)
    setPhone(user.phone)
    setOpen(true)
  }

  const handleEditModalClose = () => {
    setOpen(false)
    setEditingUserId('')
    setName('')
    setEmail('')
    setPhone('')
  }

  const handleDelete = (id: string) => {
    const updatedUsers = users.filter((user) => user.id !== id)
    setUsers(updatedUsers)
    handleDeleteContato(id)
  }

  const handleEdited = (id: string, updatedUserData: UpdatedUserData) => {
    console.log(id)
    axios.patch(
      `http://localhost:3000/schedule/${id}`,
      {
        ...updatedUserData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
  }

  const handleEdit = (id: string, updatedUserData: UpdatedUserData) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, ...updatedUserData } : user,
    )
    console.log(updatedUsers)

    setUsers(updatedUsers)
    handleEdited(id, updatedUserData)
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
        <button
          className="bg-yellow-400 w-[100%]"
          onClick={() => handleEditModalOpen(params.row)}
        >
          Edit
        </button>
      ),
    },
    {
      field: 'Remove',
      headerName: 'Remove',
      width: 100,
      renderCell: (params: GridCellParams) => (
        <button
          className="bg-red-400 w-[100%]"
          onClick={() => handleDelete(params.row.id)}
        >
          Remove
        </button>
      ),
    },
  ]

  return (
    <div style={{ height: 400, width: '100%' }}>
      {users.length === 0 ? (
        <h1 className="block text-sm font-medium leading-6 text-gray-900">
          You haven't created any contacts yet :(
        </h1>
      ) : (
        <DataGrid rows={users} columns={columns} checkboxSelection />
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="relative p-4">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Contact Register
            </Typography>
            <button
              onClick={handleClose}
              className="absolute top-0 right-0 m-5 font-bold"
            >
              X
            </button>
            <form className="mt-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Contact Name"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Contact Email"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="phone"
                  type="tel"
                  placeholder="Contact Phone"
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  )
}
