select * from faculty;
select * from SUBJECT;
select * from TEACHER;
select * from pulpit join teacher on PULPIT.PULPIT = TEACHER.PULPIT
where TEACHER_NAME like '%Владимир%';
select count(*) from AUDITORIUM group by AUDITORIUM_CAPACITY, AUDITORIUM_TYPE;

select * from subject
left join pulpit on pulpit.PULPIT = SUBJECT.PULPIT
left join faculty on FACULTY.FACULTY = PULPIT.FACULTY 
where FACULTY.FACULTY = 'ТОВ' 
where FACULTY.FACULTY = 'ИДиП'

ALTER TABLE [dbo].[PULPIT] 
ADD CONSTRAINT [FK_PULPIT_FACULTY] FOREIGN KEY([FACULTY])
REFERENCES [dbo].[FACULTY] ([FACULTY])
ON DELETE CASCADE
GO

