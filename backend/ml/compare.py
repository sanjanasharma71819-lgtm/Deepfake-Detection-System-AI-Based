from ml.predictor_cnn import predict_cnn


def compare_models(image_path):

    cnn_result = predict_cnn(image_path)

    return {
        "cnn": cnn_result,
        "final": cnn_result
    }