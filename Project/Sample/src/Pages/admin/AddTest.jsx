import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddTest.css";
import Sidebar from './sidebar';

const ManMockTestForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
        totalMarks: "",
        numberOfQuestions: "",
        passingMarks: "",
        questions: []
    });

    const [currentQuestion, setCurrentQuestion] = useState({
        questionText: "",
        options: [{ optionText: "", isCorrect: false }],
        marks: "",
        steps: [""]
    });

    const [tests, setTests] = useState([]);
    const [editingTest, setEditingTest] = useState(null);
    const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/test/viewallmocktest`);
            setTests(response.data);
        } catch (error) {
            console.error("Error fetching tests:", error);
        }
    };

    // Handle input changes for test fields
    const handleChange = (e) => {
        // Add validation for numberOfQuestions
        if (e.target.name === 'numberOfQuestions') {
            const value = parseInt(e.target.value);
            if (value < formData.questions.length) {
                alert(`Cannot set number of questions less than current questions count (${formData.questions.length})`);
                return;
            }
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle question input changes
    const handleQuestionChange = (e) => {
        setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
    };

    // Handle option input changes
    const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...currentQuestion.options];
        updatedOptions[index][field] = value;
        setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
    };

    // Add new option to the current question
    const handleAddOption = () => {
        setCurrentQuestion({
            ...currentQuestion,
            options: [...currentQuestion.options, { optionText: "", isCorrect: false }]
        });
    };

    // Handle step input changes
    const handleStepChange = (index, value) => {
        const updatedSteps = [...currentQuestion.steps];
        updatedSteps[index] = value;
        setCurrentQuestion({ ...currentQuestion, steps: updatedSteps });
    };

    // Add new step to the question
    const handleAddStep = () => {
        setCurrentQuestion({ ...currentQuestion, steps: [...currentQuestion.steps, ""] });
    };

    // Add these functions to handle question editing and deletion
    const handleEditQuestion = (questionIndex) => {
        const question = formData.questions[questionIndex];
        setCurrentQuestion({
            questionText: question.questionText,
            options: [...question.options],
            marks: question.marks,
            steps: [...question.steps]
        });
        setEditingQuestionIndex(questionIndex);
    };

    const handleDeleteQuestion = (questionIndex) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            const updatedQuestions = formData.questions.filter((_, index) => index !== questionIndex);
            setFormData({
                ...formData,
                questions: updatedQuestions,
                numberOfQuestions: String(updatedQuestions.length)
            });
        }
    };

    // Modify handleAddQuestion to handle both adding and updating questions
    const handleAddQuestion = () => {
        // Validation checks...
        if (!currentQuestion.questionText?.trim()) {
            alert("Please enter question text.");
            return;
        }
        // ... other validation checks ...

        const updatedQuestions = [...formData.questions];
        
        if (editingQuestionIndex !== null) {
            // Update existing question
            updatedQuestions[editingQuestionIndex] = { ...currentQuestion };
        } else {
            // Add new question
            updatedQuestions.push({ ...currentQuestion });
        }

        setFormData({
            ...formData,
            questions: updatedQuestions,
            numberOfQuestions: String(updatedQuestions.length)
        });

        // Reset current question and editing state
        setCurrentQuestion({
            questionText: "",
            options: [{ optionText: "", isCorrect: false }],
            marks: "",
            steps: [""]
        });
        setEditingQuestionIndex(null);
    };

    // Add these functions for edit and delete
    const handleEdit = (test) => {
        setEditingTest(test);
        setFormData({
            title: test.title,
            description: test.description,
            duration: test.duration,
            totalMarks: test.totalMarks,
            numberOfQuestions: test.numberOfQuestions,
            passingMarks: test.passingMarks,
            questions: test.questions
        });
    };

    const handleDelete = async (testId) => {
        if (window.confirm("Are you sure you want to delete this test?")) {
            try {
                await axios.delete(`${import.meta.env.VITE_URL}/test/delete/${testId}`);
                alert("Test deleted successfully");
                fetchTests();
            } catch (error) {
                console.error("Error deleting test:", error);
                alert("Error deleting test");
            }
        }
    };

    // Modify handleSubmit to handle both create and update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTest) {
                await axios.put(`${import.meta.env.VITE_URL}/test/update/${editingTest._id}`, formData);
                alert("Test updated successfully");
            } else {
                await axios.post(`${import.meta.env.VITE_URL}/test/add`, formData);
                alert("Test added successfully");
            }
            setFormData({
                title: "",
                description: "",
                duration: "",
                totalMarks: "",
                numberOfQuestions: "",
                passingMarks: "",
                questions: []
            });
            setEditingTest(null);
            fetchTests();
        } catch (error) {
            alert("Error: " + error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="home-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo-container">
                    <img
                        src="src/assets/CareerPathway.png"
                        alt="Career Pathway Logo"
                        className="logo"
                    />
                </div>
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="content">
                <div className="welcome-section">
                    <div className="section-header">
                        <h2>{editingTest ? 'Edit Test' : 'Add New Test'}</h2>
                    </div>
                    
                    {/* Add this section to display existing tests */}
                    <div className="existing-tests">
                        <h3>Existing Tests</h3>
                        <div className="tests-grid">
                            {tests.map((test) => (
                                <div key={test._id} className="test-card">
                                    <h4>{test.title}</h4>
                                    <p>Duration: {test.duration} minutes</p>
                                    <p>Total Marks: {test.totalMarks}</p>
                                    <div className="test-actions">
                                        <button onClick={() => handleEdit(test)}>Edit</button>
                                        <button onClick={() => handleDelete(test._id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="add-test-container">
                        <form className="test-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input 
                                    type="text" 
                                    name="title" 
                                    placeholder="Title" 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    required 
                                    className="input-field"
                                />
                                <input 
                                    type="text" 
                                    name="description" 
                                    placeholder="Description" 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    required 
                                    className="input-field"
                                />
                                <input 
                                    type="number" 
                                    name="duration" 
                                    placeholder="Duration (minutes)" 
                                    value={formData.duration} 
                                    onChange={handleChange} 
                                    required 
                                    className="input-field"
                                />
                                <input 
                                    type="number" 
                                    name="totalMarks" 
                                    placeholder="Total Marks" 
                                    value={formData.totalMarks} 
                                    onChange={handleChange} 
                                    required 
                                    className="input-field"
                                />
                                <input 
                                    type="number" 
                                    name="numberOfQuestions" 
                                    placeholder="Number of Questions" 
                                    value={formData.numberOfQuestions} 
                                    onChange={handleChange} 
                                    required 
                                    className="input-field"
                                />
                                <input 
                                    type="number" 
                                    name="passingMarks" 
                                    placeholder="Passing Marks" 
                                    value={formData.passingMarks} 
                                    onChange={handleChange} 
                                    required 
                                    className="input-field"
                                />
                            </div>

                            {formData.numberOfQuestions && (
                                <div className="progress-indicator">
                                    Questions added: {formData.questions.length} / {formData.numberOfQuestions}
                                </div>
                            )}

                            {(!formData.numberOfQuestions || formData.questions.length < parseInt(formData.numberOfQuestions)) ? (
                                <div className="question-section">
                                    <h3 className="question-title">Add Question</h3>
                                    <input 
                                        type="text" 
                                        name="questionText" 
                                        placeholder="Question" 
                                        value={currentQuestion.questionText} 
                                        onChange={handleQuestionChange} 
                                        required 
                                        className="input-field"
                                    />
                                    <input 
                                        type="number" 
                                        name="marks" 
                                        placeholder="Marks" 
                                        value={currentQuestion.marks} 
                                        onChange={handleQuestionChange} 
                                        required 
                                        className="input-field"
                                    />

                                    <h4 className="question-title">Options</h4>
                                    <div className="options-container">
                                        {currentQuestion.options.map((option, index) => (
                                            <div key={index} className="option-group">
                                                <input
                                                    type="text"
                                                    placeholder={`Option ${index + 1}`}
                                                    value={option.optionText}
                                                    onChange={(e) => handleOptionChange(index, "optionText", e.target.value)}
                                                    required
                                                    className="input-field option-input"
                                                />
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={option.isCorrect}
                                                        onChange={(e) => handleOptionChange(index, "isCorrect", e.target.checked)}
                                                    />
                                                    Correct
                                                </label>
                                            </div>
                                        ))}
                                        <button type="button" onClick={handleAddOption} className="button add-button">Add Option</button>
                                    </div>

                                    <h4 className="question-title">Steps</h4>
                                    <div className="steps-container">
                                        {currentQuestion.steps.map((step, index) => (
                                            <div key={index}>
                                                <input
                                                    type="text"
                                                    placeholder={`Step ${index + 1}`}
                                                    value={step}
                                                    onChange={(e) => handleStepChange(index, e.target.value)}
                                                    required
                                                    className="input-field"
                                                />
                                            </div>
                                        ))}
                                        <button type="button" onClick={handleAddStep} className="button add-button">Add Step</button>
                                    </div>

                                    <button type="button" onClick={handleAddQuestion} className="button add-button">Add Question</button>
                                </div>
                            ) : (
                                <p className="max-questions-message">Maximum number of questions reached.</p>
                            )}

                            <div className="existing-questions">
                                <h3>Current Questions</h3>
                                {formData.questions.map((question, index) => (
                                    <div key={index} className="question-card">
                                        <div className="question-header">
                                            <h4>Question {index + 1}</h4>
                                            <div className="question-actions">
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleEditQuestion(index)}
                                                    className="edit-button"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleDeleteQuestion(index)}
                                                    className="delete-button"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        <p><strong>Question:</strong> {question.questionText}</p>
                                        <p><strong>Marks:</strong> {question.marks}</p>
                                        <div className="options-list">
                                            <strong>Options:</strong>
                                            <ul>
                                                {question.options.map((option, optIndex) => (
                                                    <li key={optIndex} className={option.isCorrect ? 'correct-option' : ''}>
                                                        {option.optionText}
                                                        {option.isCorrect && ' (Correct)'}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                type="submit" 
                                className="button submit-button"
                                disabled={!formData.numberOfQuestions || formData.questions.length !== parseInt(formData.numberOfQuestions)}
                            >
                                Submit Test
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManMockTestForm;
