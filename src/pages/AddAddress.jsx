import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { provincesState, addAddressState } from '../components/atom';
import { GrLocation } from 'react-icons/gr';
import { BsPerson, BsTelephone } from 'react-icons/bs';
import { AiOutlineMail } from 'react-icons/ai';

function AddAddress() {
  // Sử dụng Recoil để quản lý trạng thái tỉnh/thành phố và thông tin địa chỉ
  const [provinces, setProvinces] = useRecoilState(provincesState);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [address, setAddress] = useRecoilState(addAddressState);
  // Hàm kiểm tra email có hợp lệ không
  const isValidEmail = (email) => {
    // Sử dụng biểu thức chính quy để kiểm tra định dạng email
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  // Hàm kiểm tra số điện thoại có hợp lệ không
  const isValidPhone = (phone) => {
    // Sử dụng biểu thức chính quy để kiểm tra định dạng số điện thoại
    const phoneRegex = /^\d{10}$/; // Ví dụ: 10 chữ số
    return phoneRegex.test(phone);
  };
  useEffect(() => {
    // Gọi API để lấy danh sách tỉnh/thành phố khi component được tải lần đầu
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/?depth=2');
        if (response.ok) {
          const data = await response.json();
          setProvinces(data);
        } else {
          console.error('Failed to fetch data from the API');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchProvinces();
  }, []);

  // Tìm danh sách quận/huyện dựa vào tên tỉnh/thành phố đã chọn.
  useEffect(() => {
    if (selectedProvince) {
      const selectedProvinceData = provinces.find((province) => province.name === selectedProvince);
      if (selectedProvinceData) {
        setDistricts(selectedProvinceData.districts);
      }
    }
  }, [selectedProvince, provinces]);

  // Hàm xử lý lưu thông tin
  const handleSave = async () => {
    if (!address.name || !address.phone || !address.email || !address.address || !selectedProvince || !selectedDistrict) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!isValidEmail(address.email)) {
      alert('Địa chỉ email không hợp lệ');
      return;
    }

    if (!isValidPhone(address.phone)) {
      alert('Số điện thoại không hợp lệ');
      return;
    }
    try {
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Rlc3QtcG9zLmRpZ2liaXJkLmlvL2FwaS92MS9mcm9udC9zaWduLXVwLXphbG8iLCJpYXQiOjE2OTc3MDkyMzcsImV4cCI6MTY5NzczMTEzNywibmJmIjoxNjk3NzA5MjM3LCJqdGkiOiJMaGJtS2p6Z3N4UGtlMzVWIiwic3ViIjoiMjI4MiIsInBydiI6IjFkMGEwMjBhY2Y1YzRiNmM0OTc5ODlkZjFhYmYwZmJkNGU4YzhkNjMifQ.9UFW6RW63R2YQko5ZqNzEolf4M2bQty8oqWbr3-Dhac';

      const response = await fetch('https://test-pos.digibird.io/api/v1/front/self/address', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: address.name,
          email: address.email,
          phone: address.phone,
          address: address.address,
          shipping_address: `${address.address}, ${selectedDistrict}, ${selectedProvince}, VN`,
          city: selectedDistrict,
          state: selectedProvince,
          country: 'VN',
          zipcode: '1',
        }),
      });

      if (response.ok) {
        // Xử lý thành công
        alert('Địa chỉ đã được thêm thành công!');
      } else {
        console.error('Lỗi khi thêm địa chỉ');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
    }
  };

  return (
    <div className=' h-screen border-4 border-gray-100 rounded '>
      <div className="text-xl font-bold p-4 mx-auto">Thêm mới địa chỉ</div>
      <div className="border-t-gray-100 border-t-4  ">
        <div className='mt-3 '>
          <div className='flex items-center font-bold ml-4'>
            <BsPerson size={20} color="#213547" />
            <p className='ml-2'>Họ và tên</p>
          </div>
          <input
            type="text"
            placeholder="Nguyễn Văn Ánh"
            className='border border-gray-200 w-5/6 mt-2 p-2 ml-4'
            value={address.name}
            onChange={(e) => setAddress({ ...address, name: e.target.value })}
          />
        </div>
        <div className='mt-3'>
          <div className='flex items-center font-bold ml-4'>
            <BsTelephone size={20} color="#213547" />
            <p className='ml-2'>Số điện thoại</p>
          </div>
          <input
            type="text"
            placeholder="0 xxx xxx xxx"
            className='border border-gray-200 w-5/6 mt-2 p-2 ml-4'
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
          />
        </div>
        <div className='mt-3'>
          <div className='flex items-center font-bold ml-4'>
            <AiOutlineMail size={20} color="#213547" />
            <p className='ml-2'>Địa chỉ Email</p>
          </div>
          <input
            type="text"
            placeholder="example@example.com"
            className='border border-gray-200 w-5/6 mt-2 p-2 ml-4'
            value={address.email}
            onChange={(e) => setAddress({ ...address, email: e.target.value })}
          />
        </div>
        <div className='mt-3'>
          <div className='flex items-center font-bold ml-4'>
            <GrLocation size={20} color="#213547" />
            <p className='ml-2'>Tỉnh, thành phố</p>
          </div>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className='border border-gray-200 w-5/6 mt-2 p-2 ml-4'
          >
            <option value=''>Chọn tỉnh/thành phố</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-3'>
          <div className='flex items-center font-bold ml-4'>
            <GrLocation size={20} color="#213547" />
            <p className='ml-2'>Quận huyện</p>
          </div>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className='border border-gray-200 w-5/6 mt-2 p-2 ml-4'
          >
            <option value=''>Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district.id} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-3 mb-4'>
          <div className='flex items-center font-bold ml-4'>
            <GrLocation size={20} color="#213547" />
            <p className='ml-2'>Địa chỉ cụ thể</p>
          </div>
          <input
            type="text"
            placeholder="23 đường số 8, phường Linh Trung,.."
            className='border border-gray-200 w-5/6 mt-2 p-2 ml-4'
            value={address.address}
            onChange={(e) => setAddress({ ...address, address: e.target.value })}
          />
        </div>

        <button
          className='bg-yellow-300 font-bold pt-2 pb-2 pl-4 pr-4 rounded ml-4'
          onClick={handleSave}
        >
          Lưu thông tin
        </button>
      </div>
    </div>
  );
}

export default AddAddress;
