
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { addressState } from '../components/atom';
import { IoMdAdd } from 'react-icons/io'
import { GrLocation } from 'react-icons/gr'
import { BsTelephone } from 'react-icons/bs'
import { AiOutlineMail } from 'react-icons/ai'
import { Link } from 'react-router-dom'
function Address() {
  // Sử dụng Recoil để lấy và cập nhật trạng thái địa chỉ
  const [addressData, setAddressData] = useRecoilState(addressState);
  // Sử dụng useEffect để gọi API và lấy dữ liệu địa chỉ khi component được tải lần đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Token xác thực
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Rlc3QtcG9zLmRpZ2liaXJkLmlvL2FwaS92MS9mcm9udC9zaWduLXVwLXphbG8iLCJpYXQiOjE2OTc3MDkyMzcsImV4cCI6MTY5NzczMTEzNywibmJmIjoxNjk3NzA5MjM3LCJqdGkiOiJMaGJtS2p6Z3N4UGtlMzVWIiwic3ViIjoiMjI4MiIsInBydiI6IjFkMGEwMjBhY2Y1YzRiNmM0OTc5ODlkZjFhYmYwZmJkNGU4YzhkNjMifQ.9UFW6RW63R2YQko5ZqNzEolf4M2bQty8oqWbr3-Dhac';
        // Gọi API để lấy danh sách địa chỉ từ máy chủ
        const response = await fetch('https://test-pos.digibird.io/api/v1/front/self/address?fields=id,xid,name,email,phone,address,shipping_address,city,state,country', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAddressData(data);
        } else {
          console.error('Failed to fetch data from the API');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchData();
  }, []);
  // Nếu dữ liệu đang được tải, hiển thị thông báo "Loading..."
  if (!addressData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='  border-t-yellow-200 border-t-2' >
      <div className='w-4/5  border-4 border-gray-100 mt-4 mx-auto h-72 rounded flex justify-center items-center '>
        <div className='w-4/5 border-4 border-gray-100 mt-4 mx-auto h-56 border-dashed flex items-center'>
          <div className='mx-auto'>
            <div className='mx-auto w-16 h-16 border-4 border-gray-100 rounded-full flex items-center justify-center '>
              <Link to="/add-address">
                <IoMdAdd size={50} color="#F3F4F6" />
              </Link>
            </div>
            <Link to="/add-address">
              <button className='mx-auto pt-2 pb-2 pl-3 pr-3 bg-gray-200 mt-2 rounded'>Thêm mới</button>
            </Link>

          </div>

        </div>
      </div>
      <div className=' border-t-yellow-200 border-t-2'>
        {addressData.data && Array.isArray(addressData.data) && addressData.data.map((address) => (
          <div key={address.xid} className='w-4/5 border-4 border-gray-100 mt-4 mx-auto h-72 rounded relative'>
            <div className='absolute right-2 top-3 text-red-500 font-bold'>Xóa</div>
            <div className='ml-4 mt-3 font-bold'>Họ và tên: {address.name}</div>
            <div className='flex h-4 items-center mt-3 ml-4 opacity-40'>
              <GrLocation />
              <span className='ml-2'>Địa chỉ</span>
            </div>
            <p className='ml-4'>{address.address}, {address.city}, {address.state}, {address.country}</p>
            <div className='flex h-4 items-center ml-4 mt-3 opacity-40'>
              <BsTelephone />
              <span className='ml-2'>Số điện thoại</span>
            </div>
            <p className='ml-4 mt-2'>{address.phone}</p>
            <div className='flex h-4 items-center ml-4 mt-3 opacity-40'>
              <AiOutlineMail />
              <span className='ml-2'>Địa chỉ email</span>
            </div>
            <p className='ml-4 mt-2'>{address.email}</p>
            <div className='ml-4 mt-3'>
              <Link to={`/address/${address.xid}`}>Chỉnh sửa</Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Address