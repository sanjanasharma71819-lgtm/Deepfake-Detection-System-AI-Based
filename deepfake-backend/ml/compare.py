from ml.predictor_cnn import predict_cnn
from ml.predictor_effnet import predict_efficientnet


def compare_models(image_path):
    cnn_result = predict_cnn(image_path)
    effnet_result = predict_efficientnet(image_path)

    # Soft voting: average softmax probabilities from both models
    # probs = [real_prob, fake_prob]
    cnn_probs = cnn_result["probs"]
    effnet_probs = effnet_result["probs"]

    avg_real = (cnn_probs[0] + effnet_probs[0]) / 2
    avg_fake = (cnn_probs[1] + effnet_probs[1]) / 2

    if avg_fake >= avg_real:
        final_label = "FAKE"
        final_confidence = round(avg_fake, 4)
    else:
        final_label = "REAL"
        final_confidence = round(avg_real, 4)

    # Strip probs from individual results before returning
    cnn_clean = {"label": cnn_result["label"], "confidence": cnn_result["confidence"]}
    effnet_clean = {"label": effnet_result["label"], "confidence": effnet_result["confidence"]}

    return {
        "final_prediction": final_label,
        "confidence": final_confidence,
        "ensemble_method": "soft_voting",
        "cnn_result": cnn_clean,
        "effnet_result": effnet_clean
    }