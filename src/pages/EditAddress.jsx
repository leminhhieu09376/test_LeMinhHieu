import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { provincesState, addressState } from '../components/atom';
import { GrLocation } from 'react-icons/gr';
import { BsPerson, BsTelephone } from 'react-icons/bs';
import { AiOutlineMail } from 'react-icons/ai';

function EditAddress() {
  const { addressId } = useParams();
  console.log(addressId)
  const [provinces, setProvinces] = useRecoilState(provincesState);
  const [addressData, setAddressData] = useRecoilState(addressState);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedAddress, setSelectedAddress] = useState({});
  const isEmailValid = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const isPhoneNumberValid = (phoneNumber) => {
    // Sử dụng biểu thức chính quy (regular expression) để kiểm tra
    const phoneRegex = /^\d{10,}$/;
    return phoneRegex.test(phoneNumber);
  }

  useEffect(() => {
    const foundAddress = addressData.data.find((address) => address.xid === addressId);
    if (foundAddress) {
      setSelectedAddress(foundAddress);
      setSelectedDistrict(foundAddress.state)
      setSelectedProvince(foundAddress.city)
    }
  }, [addressData, addressId]);

  console.log(selectedAddress)
  //fetch api tỉnh/ thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/?depth=2');
        if (response.ok) {
          const data = await response.json();
          setProvinces(data); // lưu data vào recoil atom
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

  console.log(selectedProvince)
  const handleSave = async () => {
    if (!isPhoneNumberValid(selectedAddress.phone)) {
      alert('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại có ít nhất 10 chữ số.');
      return; // Dừng việc lưu dữ liệu nếu số điện thoại không hợp lệ
    }
    if (!isEmailValid(selectedAddress.email)) {
      alert('Địa chỉ email không hợp lệ. Vui lòng nhập địa chỉ email hợp lệ.');
      return; // Dừng việc lưu dữ liệu nếu địa chỉ email không hợp lệ
    }
    const apiUrl = `https://test-pos.digibird.io/api/v1/front/self/address/${addressId}`;
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Rlc3QtcG9zLmRpZ2liaXJkLmlvL2FwaS92MS9mcm9udC9zaWduLXVwLXphbG8iLCJpYXQiOjE2OTc3MDExNDMsImV4cCI6MTY5NzcyMzA0MywibmJmIjoxNjk3NzAxMTQzLCJqdGkiOiJrSkkxVVIySmR2elk1ZnlKIiwic3ViIjoiMjI4MiIsInBydiI6IjFkMGEwMjBhY2Y1YzRiNmM0OTc5ODlkZjFhYmYwZmJkNGU4YzhkNjMifQ.788VshCH9hEhI50nG10tRrjJNt-LAGUQZY5HkOlzOkM'; // Thay YOUR_ACCESS_TOKEN bằng token của bạn

    // Tạo một đối tượng chứa thông tin cần cập nhật
    const updatedAddressData = {
      name: selectedAddress.name,
      email: selectedAddress.email,
      phone: selectedAddress.phone,
      address: selectedAddress.address,
      shipping_address: selectedAddress.shipping_address,
      city: selectedProvince, // Lấy giá trị từ selectedProvince
      state: selectedDistrict, // Lấy giá trị từ selectedDistrict
      country: 'VN',
      zipcode: '1'
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedAddressData),
      });

      if (response.ok) {
        // Cập nhật thành công, có thể xử lý logic sau khi lưu dữ liệu.
        alert('Cập nhật thông tin thành công.');
      } else {
        console.error('Có lỗi xảy ra khi cập nhật thông tin:', response.statusText);
        alert('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi gọi API:', error);
      alert('Có lỗi xảy ra khi gọi API. Vui lòng thử lại sau.');
    }

  };
  return (
    <div className=' h-screen border-4 border-gray-100 rounded '>
      <div className="text-xl font-bold p-4 mx-auto">Chỉnh sửa địa chỉ</div>
      <div className="border-t-gray-100 border-t-4  ">
        <div className='mt-3 '>
          <div className='flex items-center font-bold ml-4'>
            <BsPerson size={20} color="#213547" />
            <p className='ml-2'>Họ và tên</p>
          </div>
          <input value={selectedAddress.name} onChange={(e) => setSelectedAddress({ ...selectedAddress, name: e.target.value })} type="text" placeholder="Nguyễn Văn Ánh" className='border border-gray-200 w-5/6 mt-2 p-2 ml-4  ' />
        </div>
        <div className='mt-3'>
          <div className='flex items-center font-bold ml-4'>
            <BsTelephone size={20} color="#213547" />
            <p className='ml-2'>Số điện thoại</p>
          </div>
          <input onChange={(e) => setSelectedAddress({ ...selectedAddress, phone: e.target.value })} value={selectedAddress.phone} type="text" placeholder="0 xxx xxx xxx" className='border border-gray-200 w-5/6 mt-2 p-2 ml-4  ' />
        </div>
        <div className='mt-3'>
          <div className='flex items-center font-bold ml-4'>
            <AiOutlineMail size={20} color="#213547" />
            <p className='ml-2'>Địa chỉ Email</p>
          </div>
          <input onChange={(e) => setSelectedAddress({ ...selectedAddress, email: e.target.value })} value={selectedAddress.email} type="text" placeholder="Nguyễn Văn Ánh" className='border border-gray-200 w-5/6 mt-2 p-2 ml-4  ' />
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
            <option value={selectedAddress.city}>{selectedAddress.city}</option>
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
            <option value={selectedAddress.city}>{selectedAddress.state}</option>
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
          <input value={selectedAddress.shipping_address} onChange={(e) => setSelectedAddress({ ...selectedAddress, shipping_address: e.target.value })} type="text" placeholder="23 đường số 8, phường Linh Trung,..." className='border border-gray-200 w-5/6 mt-2 p-2 ml-4' />
        </div>
        <button onClick={handleSave} className='bg-yellow-300 font-bold pt-2 pb-2 pl-4 pr-4 rounded ml-4'>
          Lưu thông tin
        </button>
      </div>
    </div>
  );
}

export default EditAddress;
