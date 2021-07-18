select DISTINCT(m.movie_id) from movies as m 
	join movies_theaters mt
	on m.movie_id = mt.movie_id
	where mt.is_showing;

select COUNT(*) from movies_theaters;
select COUNT(*) from movies_theaters mt where is_showing;

update movies_theaters
set is_showing=false
where movie_id = 1;

select DISTINCT(t.theater_id) from theaters as t 
	join movies_theaters as mt
	on t.theater_id = mt.theater_id
	join movies as m
	on mt.movie_id = m.movie_id
--	on m.movie_id = mt.movie_id
	where mt.is_showing and m.movie_id=1;