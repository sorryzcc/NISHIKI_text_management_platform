INSERT INTO ClientText (ID, TextChangeTag)
VALUES {{values}}
ON DUPLICATE KEY UPDATE
TextChangeTag = VALUES(TextChangeTag);