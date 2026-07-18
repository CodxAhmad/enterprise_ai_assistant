import mlflow

print("Tracking URI:", mlflow.get_tracking_uri())

with mlflow.start_run() as run:

    print("Run ID:", run.info.run_id)

    mlflow.log_param(
        "embedding_model",
        "bge-small-en-v1.5"
    )

    mlflow.log_metric(
        "faithfulness_score",
        0.92
    )

print("Logged Successfully")