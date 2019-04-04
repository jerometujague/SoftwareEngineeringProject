package com.commercebank.dao;

import com.commercebank.mapper.UnavailableMapper;
import com.commercebank.model.Unavailable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UnavailableDAO {
    // The JdbcTemplate is the class that interfaces with the database
    private final JdbcTemplate jdbcTemplate;
    private final UnavailableMapper unavailableMapper;

    @Autowired // This tells Spring to use the JdbcTemplate Bean we created in the configuration class
    UnavailableDAO(final JdbcTemplate jdbcTemplate, final UnavailableMapper unavailableMapper){
        // Set up the dependencies from Spring
        this.jdbcTemplate = jdbcTemplate;
        this.unavailableMapper = unavailableMapper;
    }

    public List<Unavailable> list(){
        // Run the SQL query on the database to select all unavailables and return a List of Unavailable objects
        return this.jdbcTemplate.query("SELECT id, calendar_id, time, NULL AS refer_id FROM unavailable", unavailableMapper);
    }

    public List<Unavailable> listBranches(){
        // Run the SQL query on the database to select unavailables that have matching branches
        return this.jdbcTemplate.query(
            "SELECT id, calendar_id, time, branch_id AS refer_id " +
                "FROM branch_unavailable " +
                "JOIN unavailable " +
                "ON branch_unavailable.unavailable_id = unavailable.id", unavailableMapper);

    }

    public List<Unavailable> listManagers(){
        // Run the SQL query on the database to select unavailables that have matching managers
        return this.jdbcTemplate.query(
            "SELECT id, calendar_id, time, manager_id AS refer_id " +
                "FROM manager_unavailable " +
                "JOIN unavailable " +
                "ON manager_unavailable.unavailable_id = unavailable.id", unavailableMapper);
    }

    public void insertManagerUnavailable(Unavailable unavailable){
        // Run the SQL queries on the database to add a new manager unavailable
        this.jdbcTemplate.update("INSERT INTO unavailable (calendar_id, time) VALUES (?, ?)",
                unavailable.getCalendarId(),
                unavailable.getTime());

        // Get the id for just inserted unavailable row
        List<Unavailable> unavailables = list();
        Unavailable unavailable1 = unavailables.get(unavailables.size());
        int newId = unavailable1.getId();

        this.jdbcTemplate.update("INSERT INTO manager_unavailable (calendar_id, manager_id) VALUES (?, ?)",
                newId,
                unavailable.getReferId());
    }

    public void deleteManagerUnavailable(int id){
        // Run the SQL query to delete a manager unavailable
        this.jdbcTemplate.update("DELETE FROM manager_unavailable WHERE unavailable_id = ?", id);
    }

    public void insertBranchUnavailable(Unavailable unavailable){
        // Run the SQL query on the database to add a new unavailable row
        this.jdbcTemplate.update("INSERT INTO unavailable (calendar_id, time) VALUES (?, ?)",
                unavailable.getCalendarId(),
                unavailable.getTime());

        // Get the id for just inserted unavailable row
        List<Unavailable> unavailables = list();
        Unavailable unavailable1 = unavailables.get(unavailables.size());
        int newId = unavailable1.getId();

        // Run the SQL query on the database to add a new row to branch_unavailable
        this.jdbcTemplate.update("INSERT INTO branch_unavailable (unavailable_id, branch_id) VALUES (?,?)",
                newId,
                unavailable.getReferId());
    }

    public void deleteBranchUnavailable(int id){
        // Run the SQL query to delete a branch unavailable
        this.jdbcTemplate.update("DELETE FROM branch_unavailable WHERE unavailable_id = ?", id);
    }
}
