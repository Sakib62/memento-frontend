import DeleteAccount from '../components/settings/DeleteAccount';
import ResetPassword from '../components/settings/ResetPassword';
import UpdateProfile from '../components/settings/UpdateProfile';

const Settings = () => {
  return (
    <div className='p-6 bg-gray-100'>
      <div className='flex flex-col max-w-3xl p-8 mx-auto bg-white rounded-md'>
        <UpdateProfile />
        <hr className='my-4 border-t-2 border-gray-300' />
        <ResetPassword />
        <hr className='my-4 border-t-2 border-gray-300' />
        <DeleteAccount />
      </div>
    </div>
  );
};

export default Settings;
