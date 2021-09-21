import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, listUsers } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_DETAILS_RESET } from '../constants/userConstants';
import Pagination from '../components/Pagination';

export default function UserListScreen(props) {
  document.title = "List of Users"
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;
  const [page, setPage] = useState(1);
  const userDelete = useSelector((state) => state.userDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = userDelete;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listUsers({page}));
    dispatch({
      type: USER_DETAILS_RESET,
    });
  }, [dispatch, successDelete, page]);
  const deleteHandler = (user) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteUser(user._id));
    }
  };
  return (
    <div className="admin-list">
      <h1>Users</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {successDelete && (
        <MessageBox variant="success">User Deleted Successfully</MessageBox>
      )}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>IS ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.results && users.results.map((user) => (
              <tr key={user._id}>
                <td className="smallscreens-table-td-users">{user._id}</td>
                <td className="smallscreens-table-td-users">{user.name}</td>
                <td className="smallscreens-table-td-users">{user.email}</td>
                <td className="smallscreens-table-td-users">{user.isAdmin ? 'YES' : 'NO'}</td>
                <td className="smallscreens-table-td-users">
                  <button
                    type="button"
                    className="small"
                    onClick={() => props.history.push(`/user/${user._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.pageNumbers &&
        <>
        {users.pageNumbers.length !== 1 &&
          <Pagination pages={users.pageNumbers.length} setCurrentPage={setPage} page={page}/>
        }
        </>
        }
        </>
      )}
    </div>
  );
}
