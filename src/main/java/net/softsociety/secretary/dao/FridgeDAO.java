package net.softsociety.secretary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import net.softsociety.secretary.domain.Fridge;

@Mapper
public interface FridgeDAO {
    List<Fridge> getAllFridges(int familyId);
    void addFridge(Fridge fridge);
    void updateFridge(Fridge fridge);
    void deleteFridge(int id);
}
