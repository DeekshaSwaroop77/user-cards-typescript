import React, { useLayoutEffect, useState, } from 'react';
import type { Dispatch, ChangeEvent, FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Modal,
    Typography,
    Button,
    IconButton,
    Card,
    CardContent,
    Grid,
    Avatar,
    Chip,
    Pagination,
    Box
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import UserModal from './userModal';
import { deletUser, getUsers } from '../../service/action/userAction';
import { Column, InputData, UserType, userDataType } from '../../interfaces/user.interface';


const columns: Column[] = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 100 },
    {
        id: 'status',
        label: 'Status',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'action',
        label: 'Action',
        minWidth: 170,
        align: 'right',
    },
];

const UserCardGrid: React.FC = () => {
    const data = useSelector((state: UserType) => state.User);
    console.log('data: ', data);
    const dispatch: Dispatch<any> = useDispatch();
    const [open, setOpen] = useState<boolean>(false);
    const [updatedata, setUpdatedata] = useState<InputData>({
      name: '',
      email: '',
      status: '',
    });
    const [page, setPage] = useState<number>(1);
    // const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const rowsPerPage = 6;
  
    const handleModal = () => setOpen(true);
    const handleCloseModal = () => {
      setOpen(false);
      setUpdatedata({ name: '', email: '', status: '' });
    };
  
    const handleEditEpisode = (row: InputData) => {
      handleModal();
      setUpdatedata(row);
      setOpen(true);
    };

  //   const handleChangePage = (newPage: any) => {
  //     // console.log('event: ', event);
  //     setPage(newPage);
  // };

//   const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
//     console.log('event: ', event);
//     setRowsPerPage(+event.target.value);
//     setPage(0);
// };

  useLayoutEffect(() => {
    dispatch(getUsers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);
  
    const deleteUser = (deletuserdata: InputData) => {
      const userarray: userDataType[] = data.userList;
      console.log('userarray: ', userarray);
      dispatch(deletUser(deletuserdata, userarray));
    };
  
    const paginatedUsers = data?.userList?.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  
    return (
      <>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h2">User Cards</Typography>
          <Button variant="contained" onClick={handleModal}>
            Create
          </Button>
        </Grid>
  
        <Grid container spacing={3}>
          {paginatedUsers?.map((user: InputData) => (
            <Grid item xs={12} sm={6} md={4} key={user.email}>
              <Card elevation={4} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Avatar>{user.name[0]}</Avatar>
                    </Grid>
                    <Grid item xs>
                      <Typography variant="h6">{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    </Grid>
                  </Grid>
  
                  <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                    <Chip
                      label={user.status}
                      color={user.status === 'active' ? 'success' : 'default'}
                    />
                    <div>
                      <IconButton onClick={() => handleEditEpisode(user)}><Edit /></IconButton>
                      <IconButton onClick={() => deleteUser(user)}><Delete /></IconButton>
                    </div>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
  
        {/* Pagination */}
        {data.userList.length > rowsPerPage && (
          <Grid container justifyContent="center" sx={{ mt: 4 }}>
            <Pagination
              count={Math.ceil(data.userList.length / rowsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Grid>
        )}
  
        {/* Modal for create/edit */}
        <Modal open={open} onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      bgcolor: 'background.paper',
      p: 4,
      borderRadius: 2,
      boxShadow: 24,
      width: 400
    }}
  >
          <UserModal updatedata={updatedata} handleModal={handleCloseModal} />
          </Box>
        </Modal>
      </>
    );
  };
  
  export default UserCardGrid;