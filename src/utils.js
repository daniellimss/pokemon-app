const formatName = (input) => {
  if (input.includes("-")) {
    const name = input.split("-");
    let result = "";
    for (let i = 0; i < name.length; i++) {
      console.log(name[i]);
      result += capitalise(name[i]);
      if (i !== name.length - 1) {
        result += " ";
      }
    }
    return result;
  } else {
    return capitalise(input);
  }
};

const capitalise = (word) => {
  const firstLetter = word.charAt(0).toUpperCase();
  const remainingLetters = word.slice(1);
  return firstLetter + remainingLetters;
};

const randomIndex = (max) => {
  return Math.floor(Math.random() * max);
};

export { formatName, randomIndex };
