def compare_models(image_path):

    cnn_result = predict_cnn(image_path)

    return {
        "final_prediction": cnn_result["label"],
        "confidence": cnn_result["confidence"],
        "cnn_result": cnn_result
    }