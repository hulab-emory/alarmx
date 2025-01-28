export function validPassword(password) {
  return password.match(
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@,_.?!#*])[a-zA-z\d$@,_.?!#*]{4,20}$/
    /^.{4,20}$/
  );
}