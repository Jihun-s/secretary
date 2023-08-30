package net.softsociety.secretary.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.softsociety.secretary.dao.FridgeDAO;
import net.softsociety.secretary.domain.Fridge;

@Service
public class FridgeServiceImpl implements FridgeService {

    @Autowired
    private FridgeDAO fridgeDAO;

    @Override
    public List<Fridge> getAllFridges(int familyId) {
        return fridgeDAO.getAllFridges(familyId);
    }

    @Override
    public void addFridge(Fridge fridge) {
        // 냉장실 추가
        fridge.setFridgeCategory("냉장실");
        fridgeDAO.addFridge(fridge);

        // 냉동실 추가
        fridge.setFridgeCategory("냉동실");
        fridgeDAO.addFridge(fridge);
    }

    @Override
    public Fridge updateFridge(int id, Fridge fridge) {
        return fridgeDAO.updateFridge(id, fridge);
    }

    @Override
    public void deleteFridge(int id) {
        fridgeDAO.deleteFridge(id);
    }
}