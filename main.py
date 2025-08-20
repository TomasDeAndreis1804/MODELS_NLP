from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

# ==============================
# 1. Esquemas de entrada
# ==============================
class FlowerModel(BaseModel):
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float

class PenguinModel(BaseModel):
    bill_length_mm: float
    bill_depth_mm: float
    flipper_length_mm: float
    body_mass_g: float

class TitanicModel(BaseModel):
    pclass: int
    sex: str
    age: float
    sibsp: int
    parch: int
    fare: float
    embarked: str
    
class GermanCreditModel(BaseModel):
    Unnamed_0: int
    Age: int
    Sex: str
    Job: int
    Housing: str
    Saving_accounts: Union[str, None] = None
    Checking_account: Union[str, None] = None
    Credit_amount: int
    Duration: int
    Purpose: str



# ==============================
# 2. Inicialización de la API
# ==============================
app = FastAPI(
    title="ML Models API",
    description="API para predecir con modelos de Iris, Penguins, Titanic y German Credit",
    version="2.0.0"
)

# ==============================
# 3. Cargar modelos
# ==============================
iris_model = joblib.load("Models/iris_best_model.pkl")
penguins_model = joblib.load("Models/penguins_rf_model.pkl")
titanic_model = joblib.load("Models/titanic_rf_model.pkl")
german_model = joblib.load("Models/german_credit.pkl") 


iris_classes = ["setosa", "versicolor", "virginica"]

penguins_classes = penguins_model.classes_.tolist()

titanic_classes = ["not survived", "survived"]

# ==============================
# 4. Endpoints
# ==============================
@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de predicción de Iris, Penguins, Titanic y German Credit"}

@app.get("/models")
def get_models():
    return {"models": ["iris", "penguins", "titanic", "german_credit"]}

# ---------- IRIS ----------
@app.post("/predict/iris")
def predict_iris(flower: FlowerModel):
    input_df = pd.DataFrame([[
        flower.sepal_length,
        flower.sepal_width,
        flower.petal_length,
        flower.petal_width
    ]], columns=['sepal length (cm)','sepal width (cm)','petal length (cm)','petal width (cm)'])

    prediction = iris_model.predict(input_df)[0]
    probabilities = iris_model.predict_proba(input_df)[0].tolist()

    return {
        "input": flower.dict(),
        "prediction": int(prediction),
        "class_name": iris_classes[prediction],
        "probabilities": dict(zip(iris_classes, probabilities))
    }

# ---------- PENGUINS ----------
@app.post("/predict/penguins")
def predict_penguins(penguin: PenguinModel):
    input_df = pd.DataFrame([[
        penguin.bill_length_mm,
        penguin.bill_depth_mm,
        penguin.flipper_length_mm,
        penguin.body_mass_g
    ]], columns=['bill_length_mm','bill_depth_mm','flipper_length_mm','body_mass_g'])

    prediction = penguins_model.predict(input_df)[0]
    probabilities = penguins_model.predict_proba(input_df)[0].tolist()

    return {
        "input": penguin.dict(),
        "prediction": prediction,
        "class_name": prediction,  # ya es string species
        "probabilities": dict(zip(penguins_classes, probabilities))
    }

# ---------- TITANIC ----------
@app.post("/predict/titanic")
def predict_titanic(passenger: TitanicModel):
    input_df = pd.DataFrame([[
        passenger.pclass,
        passenger.sex,
        passenger.age,
        passenger.sibsp,
        passenger.parch,
        passenger.fare,
        passenger.embarked
    ]], columns=["pclass","sex","age","sibsp","parch","fare","embarked"])

    prediction = titanic_model.predict(input_df)[0]
    probabilities = titanic_model.predict_proba(input_df)[0].tolist()

    return {
        "input": passenger.dict(),
        "prediction": int(prediction),
        "class_name": titanic_classes[prediction],
        "probabilities": dict(zip(titanic_classes, probabilities))
    }



# ---------- GERMAN ----------
@app.post("/predict/german_credit")
def predict_german(data: GermanCreditModel):
    # Convertir a DataFrame
    df = pd.DataFrame([data.dict()])
    
    rename_dict = {
        "Unnamed_0": "Unnamed: 0",
        "Age": "Age",
        "Sex": "Sex",
        "Job": "Job",
        "Housing": "Housing",
        "Saving_accounts": "Saving accounts",
        "Checking_account": "Checking account",
        "Credit_amount": "Credit amount",
        "Duration": "Duration",
        "Purpose": "Purpose"
    }
    df = df.rename(columns=rename_dict)

    # Hacer predicción
    prediction = german_model.predict(df)[0]
    proba = german_model.predict_proba(df).max()
    
    return {
        "input": data.dict(),
        "prediction": prediction,
        "probability": float(proba)
    }
