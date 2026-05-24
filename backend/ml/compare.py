from ml.predictor_cnn import predict_cnn
from ml.predictor_effnet import predict_efficientnet


def compare_models(image_path):

    cnn_result = predict_cnn(image_path)
    eff_result = predict_efficientnet(image_path)

    cnn_conf = cnn_result["confidence"]
    eff_conf = eff_result["confidence"]

   
    cnn_weight = 0.4
    eff_weight = 0.6

    cnn_score = cnn_conf * cnn_weight
    eff_score = eff_conf * eff_weight

    final = eff_result if eff_score > cnn_score else cnn_result

    return {
        "cnn": cnn_result,
        "efficientnet": eff_result,
        "final": final
    }