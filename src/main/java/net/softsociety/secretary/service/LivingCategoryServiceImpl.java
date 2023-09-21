package net.softsociety.secretary.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.softsociety.secretary.dao.LivingCategoryDAO;
import net.softsociety.secretary.domain.LivingCategory;

@Service
public class LivingCategoryServiceImpl implements LivingCategoryService {

	@Autowired
	private LivingCategoryDAO livingCategoryDAO;
	
	@Override
	public List<LivingCategory> getAllCategoriesByFamily(int familyId) {
		return livingCategoryDAO.getAllCategoriesByFamily(familyId);
	}

	@Override
	public int addCategory(LivingCategory itemCategory) {
		return livingCategoryDAO.addCategory(itemCategory);
	}

}
