import { useState, useEffect } from 'react'
import PopupWithForm from './PopupWithForm'

function EditAvatarPopup(props) {
    const {isOpen,onClose,submit} = props;
    const [fields,setFields] = useState({});
    const [errors,setErrors] = useState({});

    useEffect(() => {
        setFields({avatar: ''});
        setErrors({})
    },[isOpen]);

    function handleChange(e) {
        setFields({[e.target.name]: e.target.value.trim() && e.target.value});
        setErrors({[e.target.name]: e.target.validationMessage});
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
            title='Change profile picture' 
            name='profile-photo' 
            isOpen={isOpen}
            onClose={onClose}
            inputs={[['url','Image link','avatar']]}
            submit={handleSubmit}
            submitText='Save'
            submitButtonState={setButtonState()}
            field={fields}
            error={errors}
            onChange={handleChange}
        />
    )
}

export default EditAvatarPopup