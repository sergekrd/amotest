const companyTypes = ['ООО', 'ОАО', 'ЗАО'];
const companyNames = ['Инвест', 'Капитал', 'Строй', 'Траст', 'Энерго', 'Авто', 'Техно', 'Пром', 'Сервис', 'Финанс', 'Групп', 'Металл', 'Пища', 'Медиа', 'Бизнес', 'Альянс', 'Логистика', 'Текстиль', 'Химия', 'Лес'];
const companyLatinNames = [
  'Invest', 'Kapital', 'Stroy', 'Trust', 'Energo', 'Avto', 'Tekhno', 'Prom', 'Servis', 'Finans',
  'Grupp', 'Metall', 'Pishcha', 'Media', 'Biznes', 'Alians', 'Logistika', 'Tekstil', 'Khimiya', 'Les'
];
const companysCount=50
const generatePhoneNumber = () => 
`+7 ${Math.random().toString().slice(2, 5)} ${Math.random().toString().slice(2, 5)}-${Math.random().toString().slice(2, 4)}-${Math.random().toString().slice(2, 4)}`;


const generateСompanyType = () => `${companyTypes[random(2)]}`;

 const random=(max) =>  Math.floor(Math.random() * (max + 1));
  
 const randomTree =(max)=> {
    array=[]    
    while (array.length<3) {
      const randomNumber=random(max)
      if (array.indexOf(randomNumber)<0){
        array.push(randomNumber)
      }
    }
    return array;
  }

 const generateFullCompany = (max)=>{
  const array=randomTree(max)
  let name=""
  let email=""
  for (i=0;i<3;i++){
    name=name+companyNames[array[i]]
    email=email+companyLatinNames[array[i]]
    }
    name=`${generateСompanyType()}"${name}"`
    email=`${email}@${email}`
  return {name:name,email:email,phone:generatePhoneNumber()}
 }

const findObjectByKey=(key, value, array)=> {
  return array.filter(companyObj => companyObj[key] === value);
}


const generatedCompanys=()=>{
  let companysArray=[]
  while (companysArray.length<companysCount) { 
    const generatedCompany=generateFullCompany(companyNames.length-1)
    if (findObjectByKey('name',generatedCompany.name,companysArray).length==0){
      companysArray.push(generatedCompany)
    }
  }
}

export {
  generatedCompanys
}; 
