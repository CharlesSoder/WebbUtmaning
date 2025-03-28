-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Värd: 127.0.0.1
-- Tid vid skapande: 20 mars 2024 kl 10:55
-- Serverversion: 10.4.14-MariaDB
-- PHP-version: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `webbserverprogrammering`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `passwd` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumpning av Data i tabell `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `userId`, `passwd`) VALUES
(1, 'Holger', 'Rosencrantz', 'holros', 'pass123'),
(2, 'Martin', 'Loman', 'marlom', 'secret'),
(3, 'Johanna', 'Isaksson', 'JOIS', 'entillhemlighet'),
(4, 'Björn', 'Larsson', 'BJLA', 'xXx'),
(5, 'Petter', 'Norrthon', 'PENO', 'nyttlösenord'),
(6, 'Mari', 'Back', 'MABI', 'ännuettlösenord'),
(7, 'Andreas', 'Lindgren', 'ANLI', 'SECRETSECRET'),
(8, 'Hejsan', 'Igen', 'HOIG', 'ettnyttlösenord'),
(9, 'Per', 'Löfgren', 'PELO', 'SecretXXX'),
(10, 'Per', 'Löfgren', 'PELO', 'SecretXXX'),
(11, 'Magnus', 'Folkesson', 'PATE', 'lökjsaölkdfj'),
(12, 'Kalle', 'Anka', 'PATE', 'undefined'),
(13, 'Andreas', 'Lindberg', '1,true,2', 'undefined'),
(15, 'Gösta', 'Körlof', 'GOKO', '2ffd39225bcecaa688491606348b09953ee86b23996b3d01668ffb586227a1a7'),
(16, 'Lillemor', 'Larsson', 'LILA', '033e887dd2004f157d1913b2e3e60d84eaa23678e605b63c2550efe7c372b2b8'),
(17, 'Påhittad', 'Lärare', 'PALA', '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b'),
(18, 'ABC', 'DEF', '1234', 'GHI'),
(19, 'Alexander', 'Lukas', '1234', 'GHI'),
(20, 'ABC', 'DEF', '1234', 'GHI'),
(21, 'Kalle', 'Anka', 'MUPI', 'MittHemligaPassword'),
(22, 'Guld-Ivar', 'Flinthjärta', 'GUFL', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3'),
(23, 'Klara-Bella', 'Ko', 'KLKO', 'dcc572669cc7781741debc38939194ad082d33178f8256652160767ff030480f'),
(24, 'Musse', 'Pigg', 'MuPi', 'Lösenord');

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;