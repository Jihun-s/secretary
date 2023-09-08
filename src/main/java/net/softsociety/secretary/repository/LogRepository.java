package net.softsociety.secretary.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import net.softsociety.secretary.domain.Log;

public interface LogRepository extends JpaRepository<Log, Long>{

}
