export default function getDate(date) {
  // let res = "";
  let datetime = new Date(date);
  let year = datetime.getFullYear();
  let month = datetime.getMonth() + 1;
  let day = datetime.getDate();
  let time = datetime.toString().substring(16, 21);

  return `${month}/${day}/${year.toString().substring(2)} ${time}`;
}
