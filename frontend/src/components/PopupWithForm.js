import Input from './Input'

function PopupWithForm(props) {
    const {name,title,isOpen,onClose,submitText,inputs,submit,field,error,onChange,submitButtonState,refButton} = props;
    return (
      <div 
        className={`popup popup_${name} ${isOpen && 'visible'}`} 
        onClick={onClose}
      >
          <form 
              action="#" 
              className="popup__form" 
              name={name} 
              onSubmit={submit}
              noValidate>
              <button className="popup__close" aria-label="close-button" type="button"></button>
              <h3 className="popup__header">{title}</h3>
              {inputs && inputs.map(([type,placeholder,name,min,max],i) => (
                <Input 
                  key={i} 
                  type={type} 
                  placeholder={placeholder} 
                  name={name}
                  min={min}
                  max={max}
                  value={field[name] || ''}
                  error={error[name]}
                  onChange={onChange}
                />
              ))}
              <button 
                  type="submit" 
                  className={`popup__submit active ${submitButtonState && 'inactive'}`} 
                  aria-label="submit-button"
                  ref={refButton}
                  disabled={submitButtonState}
              >
                    {isOpen && submitText}
              </button>
          </form>
      </div>
    )
}

export default PopupWithForm