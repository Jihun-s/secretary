package net.softsociety.secretary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import net.softsociety.secretary.domain.FridgeFood;
import net.softsociety.secretary.dao.FridgeFoodDAO;

@Service
public class FridgeFoodServiceImpl implements FridgeFoodService {

    @Autowired
    private FridgeFoodDAO fridgeFoodDAO;

    @Override
    public void addFridgeFood(FridgeFood fridgeFood) {
        fridgeFoodDAO.insertFridgeFood(fridgeFood);
    }
}