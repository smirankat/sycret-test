import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState("Выберите товар"); 
  const [showButton, setShowButton] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({name: "",phone: "",email: ""});
  const [nameDirty, setNameDirty] = useState(false);
  const [emailDirty, setEmailDirty] = useState(false);
  const [phoneDirty, setPhoneDirty] = useState(false);
  const [nameError, setNameError] = useState("ФИО не может быть пустым");
  const [emailError, setEmailError] = useState("Email не может быть пустым");
  const [phoneError, setPhoneError] = useState("Номер телефона не может быть пустым");
  const [isClicked, setIsClicked] = useState(false)
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    if (nameError || emailError || phoneError) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [nameError, emailError, phoneError]);


useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    const response = await fetch(
      "https://sycret.ru/service/api/api?MethodName=OSGetGoodList&APIKey=011ba11bdcad4fa396660c2ec447ef14"
    ).then((response) => response.json());
      setOptions(response.data)
      setLoading(false)
  };
  fetchData();
}, []);


const handleChange = (event) => {
  const { name, value } = event.target;
  setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

if(name==="name") {
  //eslint-disable-next-line
  const re = /^([А-ЯA-Z]|[А-ЯA-Z][\x27а-яa-z]{1,}|[А-ЯA-Z][\x27а-яa-z]{1,}\-([А-ЯA-Z][\x27а-яa-z]{1,}|(оглы)|(кызы)))\040[А-ЯA-Z][\x27а-яa-z]{1,}(\040[А-ЯA-Z][\x27а-яa-z]{1,})?$/;
  if (!re.test(event.target.value)) {
    setNameError("Вы неверно указали имя");
    if (!event.target.value) {
      setNameError("ФИО не может быть пустым");
    }
  } else {
    setNameError("");
  }
}

if(name==="phone") {
  const re = /(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?/;
  if (!re.test(event.target.value)) {
    setPhoneError("Вы неверно указали номер телефона");
    if (!event.target.value) {
      setPhoneError("Номер телефона не может быть пустым");
    }
  } else {
    setPhoneError("");
  }
}
window.$("#phone").mask("+7(999)999-99-99");


if(name==="email") {
  const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!re.test(String(event.target.value).toLowerCase())) {
    setEmailError("Некорректный email");
    if (!event.target.value) {
      setEmailError("Email не может быть пустым");
    }
  } else {
    setEmailError("");
  }
}
};

const blurHandler = (e) => {
  switch (e.target.name) {
    case "name":
      setNameDirty(true);
      break;
    case "email":
      setEmailDirty(true);
      break;
    case "phone":
      setPhoneDirty(true);
      break;
  }
};

const handleBack = () => {
  setShowForm(false)
  setFormData({name: "",phone: "",email: ""})
  setIsClicked(false)
  setNameDirty(false)
  setPhoneDirty(false)
  setEmailDirty(false)
  setNameError("ФИО не может быть пустым")
  setPhoneError("Номер телефона не может быть пустым")
  setEmailError("Email не может быть пустым")
}

const handleSubmit = (event) => {
  event.preventDefault();

  formValid && fetch('https://sycret.ru/service/api/api?MethodName=OSSale&APIKey=011ba11bdcad4fa396660c2ec447ef14', {
    method: 'POST',
    // mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    }).then(() => {
      setShowForm(false)
      setFormData({name: "",phone: "",email: ""})
    }); 
    setIsClicked(true)
}



return (
    <>
      <div>
        <a href="https://sycret.ru/" target="_blank" >
          <img src="/logo.svg" className="logo" alt="Sycret logo" />
        </a>
      </div>
      <h1>онлайн продажи</h1>
      {loading && <p>Loading...</p>}
      {!loading && (
      <form action="">
        <div className="select-wrapper">
          <label htmlFor="certificates">Сертификаты</label>
          <select id="certificates"
          value={selectedOption}
          onChange={e => setSelectedOption(e.target.value)}
          onClick={() => (selectedOption !== "Выберите товар") && setShowButton(true)}
          >
            <option hidden>Выберите товар</option>
             {options.map(o => (
            <option key={o.ID} value={o.NAME} >{o.NAME}</option>
          ))}
          </select>
        </div>
      </form>
      )}
      <div className="book">
        {showButton && !showForm && <button onClick={() => setShowForm(true)} >
          Оформить
        </button>}
        {showForm && 
        <div className="buy">
           <button onClick={handleBack}>Назад</button>
           <a href="#!"><button type="submit" onClick={handleSubmit}>Оплатить</button></a>
          </div>
         }
      </div>
        {showForm && <form className="form" >
          <legend>{selectedOption}</legend>
          <label htmlFor="name"
             className={nameError==='Вы неверно указали имя' ? "label_red" : undefined}
          >Фамилия и имя *</label>
          <input type="text" id="name" name="name"
             className={nameError==='Вы неверно указали имя' ? "input_red" : undefined}
             value={formData.name}
             onChange={handleChange} 
             onBlur={(e) => blurHandler(e)}
             placeholder="Введите..." />
          {(nameDirty && nameError || isClicked) && (
            <p className="error"><em>{nameError}</em></p>
          )}
          <label htmlFor="phone"
             className={phoneError==='Вы неверно указали номер телефона' ? "label_red" : undefined}
          >Номер телефона *</label>
          <input type="tel" id="phone" name="phone"
             className={phoneError==='Вы неверно указали номер телефона' ? "input_red" : undefined}
             value={formData.phone}
             onChange={handleChange} 
             onBlur={(e) => blurHandler(e)}
             placeholder="+7 (___) ___-__-__" />
          {(phoneDirty && phoneError || isClicked) && (
            <p className="error"><em>{phoneError}</em></p>
          )}
          <label htmlFor="email"
             className={emailError==='Некорректный email' ? "label_red" : undefined}
          >E-mail *</label>
          <input type="email" id="email" name="email"
             className={emailError==='Некорректный email' ? "input_red" : undefined}
             value={formData.email}
             onChange={handleChange} 
             onBlur={(e) => blurHandler(e)}
             placeholder="Введите..." />
          {((emailDirty && emailError) || isClicked) && (
            <p className="error"><em>{emailError}</em></p>
          )}
        </form>}
    </>
  )
}

export default App