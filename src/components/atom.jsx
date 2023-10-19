import { atom } from 'recoil';

export const provincesState = atom({
    key: 'provincesState',
    default: [],
});


export const addressState = atom({
    key: 'addressState',
    default: null,
});

export const addAddressState = atom({
    key: 'addressState',
    default: {
        name: '',
        phone: '',
        email: '',
        city: '',
        state: '',
        address: '',
    },
});