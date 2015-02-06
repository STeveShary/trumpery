exports.COUNTDOWN_TIME_BEFORE_GAME = 10 * 1000;
exports.TIME_TO_ANSWER_QUESTION = 27 * 1000;
exports.TIME_TO_READ_QUESTION = 5 * 1000;
exports.TIME_TILL_NEXT_QUESTION = 28 * 1000;
exports.MAX_SCORE = 1000;
exports.TIME_PER_QUESTION = exports.TIME_TO_ANSWER_QUESTION + exports.TIME_TO_READ_QUESTION + exports.TIME_TILL_NEXT_QUESTION;

exports.questions = [
  {
    "category": "Science",
    "question": "What sense is most closely linked to memory?",
    "answers": ["Smell", "Taste", "Touch", "Sight"],
    "correctAnswer": 0,
    "answerText": "The sense of smell is closely linked with memory, probably more so than any of our other senses.  Those with full olfactory function may be able to think of smells that evoke particular memories; the scent of an orchard in blossom conjuring up recollections of a childhood picnic, for example."
  },
  {
    "category": "World",
    "question": "What three colors are on the French flag?",
    "answers": ["red, white and black", "blue, green and black", "red, white, and blue", "red, white, and green"],
    "correctAnswer": 2,
    "answerText": "The national flag of France is a tricolour flag featuring three vertical bands coloured blue (hoist side), white, and red. It is known to English speakers as the French Tricolour"
  },
  {
    "category": "Geography",
    "question": "Which South American city features the exclusive Copacabana beach and Ipanema?",
    "answers": ["Sao Paulo", "Rio de Janeiro", "Buenos Aires", "Santiago"],
    "correctAnswer": 1,
    "answerText": "The word \"Ipanema\" comes from the Tupi language and means \"stinky lake\""
  },
  {
    "category": "Movies",
    "question": "Which top-grossing film about the Von Trapp family starring Julie Andrews premiered?",
    "answers": ["Cinderella", "Mary Poppins", "The Phantom of the Opera", "The Sound of Music"],
    "correctAnswer": 3,
    "answerText": "On March 2, 1965, 20th Century Fox released a film adaption of \"The Sound of Music\" starring Julie Andrews as Maria Rainer and Christopher Plummer as Captain Georg von Trapp."
  },
  {
    "category": "Sports",
    "question": "Which famous quarterback signed by the New York Jets was also a Broadway actor?",
    "answers": ["Richard Todd", "Joe Namath", "Brett Favre", "Peyton Manning"],
    "correctAnswer": 1,
    "answerText": "Joe Namath, nicknamed \"Broadway Joe\" or \"Joe Willie\", was on TV shows including: Married... with Children, Here's Lucy, The Brady Bunch, The Flip Wilson Show, Rowan and Martin's Laugh-In, The Dean Martin Show, The Simpsons, The A-Team, ALF and The John Larroquette Show"
  },
  {
    "category": "Sports",
    "question": "How many rings are there on a five-zone archery target?",
    "answers": ["3", "4", "5", "6"],
    "correctAnswer": 1,
    "answerText": "The center of the target is a circle with four rings."
  },
  {
    "category": "Literature",
    "question": "What is the name of the young hero raised by wolves in Rudyard Kipling’s Jungle Book volumes?",
    "answers": ["Boy", "Tarzan", "Rikki-Tikki-Tavi", "Mowgli"],
    "correctAnswer": 3,
    "answerText": "Lost by his parents in the Indian jungle during a tiger attack, a human baby is adopted by the wolves Mother (Raksha) and Father Wolf, who call him Mowgli the Frog because of his lack of fur and his refusal to sit still."
  },
  {
    "category": "Science",
    "question": "What unit of distance was officially defined, in 1795, as being one-ten millionths of the distance from the North Pole to the equator? ",
    "answers": ["League", "Meter", "Foot", "Angstrom"],
    "correctAnswer": 1,
    "answerText": "Originally intended to be one ten-millionth of the distance from the Earth's equator to the North Pole (at sea level), its definition has been periodically refined to reflect growing knowledge of metrology"
  },
  {
    "category": "Science",
    "question": "In which year was the periodic table of elements created?",
    "answers": ["1869", "1904", "1540", "1931"],
    "correctAnswer": 0,
    "answerText": "The table has served chemistry students since 1869, when it was created by Dmitry Mendeleyev, to describe all 63 then-known elements."
  },
  {
    "category": "Geography",
    "question": "How many states are in Mexico?",
    "answers": ["15", "52", "109", "31"],
    "correctAnswer": 3,
    "answerText": "The United Mexican States is a federal republic composed of 32 federal entities: 31 states and one \"federal district\" (Mexico City)."
  },
  {
    "category": "Movies",
    "question": "What was the first, permanent, successful movie theatre in America?",
    "answers": ["Apollo Theatre", "Grauman's Chinese Theatre", "The Nickelodeon", "The Globe"],
    "correctAnswer": 2,
    "answerText": "The first successful permanent theatre showing only films was \"The Nickelodeon\", which was opened in Pittsburgh in 1905."
  },
  {
    "category": "Geography",
    "question": "What state’s gourmets devour 3.6 cans of Spam per second, double the rate of the rest of the U.S.?",
    "answers": ["Colorado", "Texas", "Mississippi", "Hawaii"],
    "correctAnswer": 3,
    "answerText": "A popular native sushi dish in Hawaii is Spam musubi, where cooked Spam is placed atop rice and wrapped in a band of nori. Varieties of Spam are found in Hawaii that are unavailable in other markets, including Honey Spam, Spam with Bacon, and Hot and Spicy Spam"
  },
  {
    "category": "Sports",
    "question": "How many minor league homeruns did Babe Ruth hit? ",
    "answers": ["1", "4", "11", "0"],
    "correctAnswer": 0,
    "answerText": "On September 5 in Toronto, Ruth pitched a one-hit 9–0 victory, and hit his first professional home run, his only one as a minor leaguer, off Ellis Johnson."
  },
  {
    "category": "History",
    "question": "JFK was the first president to broadcast press conferences live on what modern electronic media?",
    "answers": ["Radio", "Telegraph", "Television", "Youtube"],
    "correctAnswer": 2,
    "answerText": "Jan 25, 1961, President Kennedy holds first live Television news conference to read a prepared statement regarding the famine in the Congo, the release of two American aviators from Russian custody and impending negotiations for an atomic test ban treaty"
  },
  {
    "category": "HTML",
    "question": "In HTML, what color is set when the bgcolor attribute on an element is set to 'chucknorris'?",
    "answers": ["Blue", "Red", "Green", "Fear"],
    "correctAnswer": 1,
    "answerText": "The rules to convert a string to color are: remove non-hex values, pad zeros, convert to RGB: \'chucknorris' -> c00c00000000 -> RGB (c00c, 0000, 0000) -> RGB (c0, 00, 00) or RGB(192, 0, 0)"
  },
  {
    "category": "Misc.",
    "question": "What does the roman numeral C represent?",
    "answers": ["50", "100", "500", "1000"],
    "correctAnswer": 1,
    "answerText": "The history and origin of Roman numerals has not been made clear by the writers of the period. What is clear is that numerals were used by the ancient Etruscans. An interesting aspect of the Etruscan numeral system is that some numbers, like in the number system of the Romans, are represented as partial subtractions"
  },
  {
    "category": "Geography",
    "question": "What is the longest river in the world?",
    "answers": ["The Mississippi", "The Amazon", "The Yangtze", "The Nile"],
    "correctAnswer": 3,
    "answerText": "The Nile is a major north-flowing river in northeastern Africa, generally regarded as the longest river in the world. It is 6,853 km (4,258 miles) long."
  },
  {
    "category": "Science",
    "question": "What eye-catching device was invented in the 17th century by Anton van Leeuwenhoek?",
    "answers": ["telescope", "binoculars", "microscope", "Eyeglasses"],
    "correctAnswer": 2,
    "answerText": "Typical magnification of a light microscope, assuming visible range light, is up to 1250x with a theoretical resolution limit of around 0.250 micrometres or 250 nanometres"
  },
  {
    "category": "Gambling",
    "question": "What do Las Vegas blackjack dealers stand on?",
    "answers": ["16", "17", "18", "19"],
    "correctAnswer": 1,
    "answerText": "Blackjack, also known as twenty-one, is the most widely played casino banking game in the world."
  },
  {
    "category": "Retail",
    "question": "In which year was Kroger started?",
    "answers": ["1820", "1899", "1913", "1883"],
    "correctAnswer": 3,
    "answerText": "The Kroger Company is an American retailer founded by Bernard Kroger in 1883 in Cincinnati, Ohio. By revenue it's the country's largest supermarket chain, second-largest general retailer (behind Walmart), and twenty-third largest company"
  }];

exports.numberOfQuestions = exports.questions.length;
