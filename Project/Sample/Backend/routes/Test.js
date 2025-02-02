const express = require('express');
const router = express.Router();
const MockTest = require('../models/Testmodel'); // Assuming the MockTest model is in the 'models' folder
const PsychometricTest = require('../models/Testmodel');


// get number of mocktest
router.get('/mocktest-status', async (req, res) => {
  try {
      const { email } = req.query;
      if (!email) {
          return res.status(400).json({ message: 'Email is required' });
      }

      // const activeMockTests = await MockTest.countDocuments({ email, status: true });
      const nonActiveMockTests = await MockTest.countDocuments({ email, status: false });

      res.status(200).json({ activeMockTests, nonActiveMockTests });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});


// Create a new mock test

// Route to add a new mock test
router.post('/add', async (req, res) => {
    try {
        const { title, description, duration, totalMarks, numberOfQuestions, questions, passingMarks } = req.body;

        // Detailed validation
        if (!title?.trim()) return res.status(400).json({ message: "Title is required" });
        if (!description?.trim()) return res.status(400).json({ message: "Description is required" });
        if (!duration || duration <= 0) return res.status(400).json({ message: "Valid duration is required" });
        if (!totalMarks || totalMarks <= 0) return res.status(400).json({ message: "Valid total marks is required" });
        if (!numberOfQuestions || numberOfQuestions <= 0) return res.status(400).json({ message: "Valid number of questions is required" });
        if (!passingMarks || passingMarks <= 0) return res.status(400).json({ message: "Valid passing marks is required" });
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: "At least one question is required" });
        }
        if (questions.length !== parseInt(numberOfQuestions)) {
            return res.status(400).json({ message: `Expected ${numberOfQuestions} questions but received ${questions.length}` });
        }

        // Validate each question
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            if (!question.questionText?.trim()) {
                return res.status(400).json({ message: `Question ${i + 1} is missing text` });
            }
            if (!question.marks || question.marks <= 0) {
                return res.status(400).json({ message: `Question ${i + 1} has invalid marks` });
            }
            if (!Array.isArray(question.options) || question.options.length < 2) {
                return res.status(400).json({ message: `Question ${i + 1} must have at least 2 options` });
            }
            if (!question.options.some(option => option.isCorrect)) {
                return res.status(400).json({ message: `Question ${i + 1} must have at least one correct option` });
            }
            if (!Array.isArray(question.steps) || question.steps.length === 0 || question.steps.some(step => !step.trim())) {
                return res.status(400).json({ message: `Question ${i + 1} must have at least one valid step` });
            }
        }

        // Calculate total marks from questions
        const calculatedTotalMarks = questions.reduce((sum, q) => sum + parseInt(q.marks), 0);
        if (calculatedTotalMarks !== parseInt(totalMarks)) {
            return res.status(400).json({ 
                message: `Sum of question marks (${calculatedTotalMarks}) does not match total marks (${totalMarks})`
            });
        }

        const newMockTest = new MockTest({
            title,
            description,
            duration,
            totalMarks,
            numberOfQuestions,
            questions,
            passingMarks
        });

        await newMockTest.save();
        res.status(201).json({ message: "Mock test added successfully", test: newMockTest });

    } catch (error) {
        res.status(500).json({ message: "Error adding mock test", error: error.message });
    }
});


// Ensure the router is exported


// Get all mock tests with entrance exam details
router.get("/viewallmocktest", async (req, res) => {
  try {
    const tests = await MockTest.find();
    res.status(200).json(tests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tests" });
  }
});


// Get a single test by ID
router.get("/:testId", async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.testId);
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// route to get deleted mocktest

// Route to get deleted mock tests with entrance exam details
router.get('/deletedmocktests', async (req, res) => { 
  try {
    // Find deleted mock tests (status: false) and populate the examId field with the entrance exam details
    const mockTests = await MockTest.find({ status: false })
      .populate('examId', 'name'); // Populating only the 'name' field of Entrance exam

    if (mockTests.length === 0) {
      return res.status(404).json({ message: 'No deleted mock tests found' });
    }

    res.json(mockTests); // Return the populated mock tests
  } catch (error) {
    console.error('Error fetching deleted mock tests:', error);
    res.status(500).json({ message: 'Error fetching deleted mock tests' });
  }
});






// Get all mock tests
router.get("/viewallmocktest", async (req, res) => {
  try {
    const tests = await MockTest.find({}, "title totalMarks");
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching mock tests", error });
  }
});

// Get a specific test by ID
router.get("/:id", async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Mock test not found" });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: "Error fetching the test", error });
  }
});


// Update a mock test by ID
router.put('/upmockTest/:id', async (req, res) => {
  try {
    const { title, examId } = req.body; // Extract title and examId from the request body

    // Check if another mock test with the same title exists for the same exam (excluding the current one)
    const existingMockTest = await MockTest.findOne({
      title,
      examId, // Ensure it matches the same exam ID
      _id: { $ne: req.params.id }, // Exclude the current mock test by its ID
    });

    if (existingMockTest) {
      return res.status(400).json({ message: 'A mock test with the same title already exists for this exam.' });
    }

    // Proceed with the update if no conflict
    const updatedMockTest = await MockTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMockTest) return res.status(404).json({ message: 'Mock test not found' });

    res.json(updatedMockTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// Soft delete a mock test (set its status to false)
router.delete('/mockTest/deactivate/:id', async (req, res) => {
  try {
    const deletedMockTest = await MockTest.findByIdAndUpdate(req.params.id, { status: false }, { new: true });
    if (!deletedMockTest) return res.status(404).json({ message: 'Mock test not found' });
    res.json({ message: 'Mock test deleted', mockTest: deletedMockTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

//enable mocktest

router.put('/enablemocktest/:id', async (req, res) => {
  try {
    const updatedMockTest = await MockTest.findByIdAndUpdate(req.params.id, {status: true}, { new: true });
    if (!updatedMockTest) return res.status(404).json({ message: 'Mock test not found' });
    res.json(updatedMockTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new psychometric test
router.post('/addTest', async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      totalMarks,
      numberOfQuestions,
      questions
    } = req.body;

    // Check for duplicate test title
    const existingTest = await PsychometricTest.findOne({ title });
    if (existingTest) {
      return res.status(400).json({ message: 'A test with this title already exists.' });
    }

    // Create the test
    const psychometricTest = new PsychometricTest({
      title,
      description,
      duration,
      totalMarks,
      numberOfQuestions,
      questions
    });

    const savedTest = await psychometricTest.save();
    res.status(201).json(savedTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get all active tests
router.get('/tests', async (req, res) => {
  try {
    const tests = await MockTest.find({ status: true });
    res.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ message: 'Error fetching tests' });
  }
});

// Get a single test by ID
router.get('/test/:id', async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({ message: 'Error fetching test details' });
  }
});

// Update a test
router.put('/updateTest/:id', async (req, res) => {
  try {
    const { title } = req.body;

    // Check for duplicate title
    const existingTest = await PsychometricTest.findOne({
      title,
      _id: { $ne: req.params.id }
    });

    if (existingTest) {
      return res.status(400).json({ message: 'A test with this title already exists.' });
    }

    const updatedTest = await PsychometricTest.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    
    if (!updatedTest) return res.status(404).json({ message: 'Test not found' });
    res.json(updatedTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deactivate a test
router.delete('/deactivateTest/:id', async (req, res) => {
  try {
    const deactivatedTest = await PsychometricTest.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!deactivatedTest) return res.status(404).json({ message: 'Test not found' });
    res.json({ message: 'Test deactivated successfully', test: deactivatedTest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new test route
router.post('/add-test', async (req, res) => {
    try {
        const newTest = new MockTest(req.body);
        const savedTest = await newTest.save();
        res.status(201).json({
            success: true,
            message: "Test created successfully",
            data: savedTest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating test",
            error: error.message
        });
    }
});

// Add this new route for submitting test answers
router.post('/:testId/submit', async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers } = req.body;

    // Fetch the test
    const test = await MockTest.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Calculate score
    let score = 0;
    let totalPossibleScore = 0;

    test.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (typeof userAnswer === 'number' && 
          question.options[userAnswer] && 
          question.options[userAnswer].isCorrect) {
        score += question.marks;
      }
      totalPossibleScore += question.marks;
    });

    // You might want to save the submission to a database here
    
    res.status(200).json({
      message: 'Test submitted successfully',
      score,
      totalPossibleScore,
      percentage: (score / totalPossibleScore) * 100
    });

  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ message: 'Error submitting test', error: error.message });
  }
});

module.exports = router;