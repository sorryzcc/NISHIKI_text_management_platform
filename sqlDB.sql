INSERT INTO ClientText (ID, TextChangeTag,Version,Context,Used,Platform),
VALUES {{values}}
ON DUPLICATE KEY UPDATE
Version = VALUES(Version),
Context = VALUES(Context),
Used = VALUES(Used),
Platform = VALUES(Platform),
TextChangeTag = VALUES(TextChangeTag);