export const stringToColor = (string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export const stringAvatar = (name, style, approved=true, showFullName=false) => {
  const fullName = name.split(' ');
  return {
    sx: {
      bgcolor: approved ? stringToColor(name) : '#a7a7a7',
      ...style,
    },
    children: showFullName ? `${fullName[0][0].toUpperCase()}${fullName[1][0].toUpperCase()}` : name[0].toUpperCase()
  }
}