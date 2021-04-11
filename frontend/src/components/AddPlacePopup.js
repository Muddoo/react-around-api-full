import { useState, useEffect } from 'react'
import PopupWithForm from './PopupWithForm'

function AddPlacePopup(props) {
    const {isOpen,onClose,submit} = props;
    const [fields,setFields] = useState({});
    const [errors,setErrors] = useState({});

    useEffect(() => {
        setFields({
            name: '',
            link: ''
        });
        setErrors({});
    },[isOpen]);

    function handleChange(e) {
        setFields({...fields, [e.target.name]: e.target.value.trim() && e.target.value});
        setErrors({...errors, [e.target.name]: e.target.validationMessage});
    }

    function setButtonState() {
        const isField = Object.values(fields).every(field => field !== '');
        const isError = Object.values(errors).some(error => error !== '');
        return isError || !isField
    }

    function handleSubmit(e) {
        e.preventDefault();
        e.target.querySelector('.popup__submit').textContent = 'Saving...';
        submit(fields);
    }

    return (
        <PopupWithForm 
            title='New place' 
            name='card' 
            isOpen={isOpen}
            onClose={onClose}
            inputs={[['text','Title','name',2,30],['url','Image link','link']]}
            submit={handleSubmit}
            submitText='Create'
            submitButtonState={setButtonState()}
            field={fields}
            error={errors}
            onChange={handleChange}
        />
    )
}

export default AddPlacePopup