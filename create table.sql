use booktravel;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  birthday DATE,
  gender VARCHAR(10)
);

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  bookId INT,
  content TEXT,
  rating INT,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (bookId) REFERENCES books(id)
);

CREATE TABLE authors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nationality VARCHAR(255),
  bio TEXT
);

ALTER TABLE books
ADD COLUMN type VARCHAR(50);

ALTER TABLE books
ADD COLUMN cover_image VARCHAR(255);


CREATE TABLE activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_at DATE NOT NULL
);


USE booktravel;  -- 选择正确的数据库

-- 插入单条活动数据
INSERT INTO activities (title, description, image_url, created_at) VALUES 
('Young Critics Book Club', 'Young Critics Book Club is a monthly book discussion for ages 8-12. We will share ideas for other great reads while enjoying fun activities and snacks. Join us anyway if you did not finish the book. A parent or guardian must be present for this event.', '/images/YoungCriticsBlog.jpg', '2023-10-12');

-- 插入多条活动数据
INSERT INTO activities (title, description, image_url, created_at) VALUES 
('Short Story Society', 'Welcome to the club! If you want to enjoy all fun, ideas, and conversation but don’t have much time, Short Story Society is the group for you! It has all the fun of a book club without the time commitment to reading a novel! We’ll discuss a short story on the second Thursday of each month. Be sure to RSVP on our events calendar. The reading list is subject to change, and we will update the date here in our blog.', '/images/ShortStoryBlogBanner.jpg', '2023-08-04'),
('2023 Senior Book Club', 'Senior Book Club meets at 3pm on the second Tuesday of the month at Luther Crest in Allentown. All are welcome.', '/images/SBCBlogBanner.jpg', '2023-07-15');




-- 为作者表插入数据
INSERT INTO authors (name, nationality, bio) VALUES
('Gabrielle Zevin', 'American', 'Gabrielle Zevin is an American author with multiple books to her credit.'),
('Donna Tartt', 'American', 'Donna Tartt is a Pulitzer Prize-winning American author, known for her meticulously crafted novels.'),
('Cheryl Strayed', 'American', 'Cheryl Strayed is an American memoirist, novelist, and essayist, best known for her memoir Wild.');

-- 第2次作者表
INSERT INTO authors (name, nationality, bio) VALUES
('J. Maarten Troost', 'Dutch', 'Known for his travel narratives, J. Maarten Troost is a Dutch-American travel writer and essayist.'),
('Peter Hessler', 'American', 'Peter Hessler is an American author and journalist who has written extensively about his experiences in China.'),
('Paul Theroux', 'American', 'Paul Theroux is an American travel writer and novelist, whose work includes numerous books on travel.'),
('Rusty Young', 'Australian', 'Rusty Young is an Australian-born writer known for his book Marching Powder about his experiences in a Bolivian prison.'),
('Bruce Chatwin', 'British', 'British travel writer Bruce Chatwin is known for his narratives on his travels, including his book In Patagonia.'),
('Che Guevara', 'Argentinian', 'Ernesto "Che" Guevara was an Argentine Marxist revolutionary, physician, author, guerrilla leader, and diplomat.'),
('Heinrich Harrer', 'Austrian', 'Heinrich Harrer was an Austrian mountaineer, sportsman, geographer, and author of the book Seven Years in Tibet.'),
('Ryszard Kapuscinski', 'Polish', 'Ryszard Kapuscinski was a Polish journalist, photographer, poet and author known for his work on Africa.');



-- 书表数据
INSERT INTO books (title, author, description, type, cover_image) VALUES
('Lost on Planet China', 'J. Maarten Troost', 'The author''s misadventures in China provide an entertaining insight into the country that is about to become the next global superpower.', 'China', '/images/cover/LostonPlanetChina.png'),

('River Town: Two Years on the Yangtze', 'Peter Hessler', 'A memoir of the author''s experiences during two years of teaching English in China.', 'China', '/images/cover/RiverTown.jpg'),

('Oracle Bones: A Journey Between China''s Past and Present', 'Peter Hessler', 'A narrative that explores China''s transformation from ancient empire to modern superpower.', 'China', '/images/cover/OracleBones.jpg'),

('Country Driving: A Chinese Road Trip', 'Peter Hessler', 'Chronicles the author''s travels through China, following the Great Wall and exploring the country''s rapid development.', 'China', '/images/cover/CountryDriving.jpg'),

('The Great Railway Bazaar', 'Paul Theroux', 'The author travels by train through Asia, including stops in India, China, Japan, and Russia.', 'Multiple', '/images/cover/TheGreatRailwayBazaar.jpg'),

('Marching Powder: A True Story of Friendship, Cocaine, and South America''s Strangest Jail', 'Rusty Young', 'The bizarre true story of a British drug trafficker''s five years inside a Bolivian prison.', 'Bolivia', '/images/cover/MarchingPowder.jpg'),

('In Patagonia', 'Bruce Chatwin', 'An English writer''s journey through Patagonia, at the southern end of South America, where he searches for a strange beast and meets various characters.', 'Multiple', '/images/cover/InPatagonia.jpg'),

('The Motorcycle Diaries', 'Che Guevara', 'A memoir that traces the early travels of Marxist revolutionary Che Guevara across South America on a motorcycle.', 'South America', '/images/cover/TheMotorcycleDiaries.jpg'),

('Seven Years in Tibet', 'Heinrich Harrer', 'An Austrian adventurer''s account of his experiences in Tibet during World War II.', 'Tibet', '/images/cover/SevenYearsinTibet.jpg'),

('The Shadow of the Sun', 'Ryszard Kapuscinski', 'The author''s experiences and observations from living in Africa over several decades.', 'Africa', '/images/cover/TheShadowoftheSun.jpg');

