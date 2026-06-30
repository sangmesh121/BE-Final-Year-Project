import tensorflow as tf
import json

model = tf.keras.models.load_model('best_v3.keras')
print(model.summary())

if hasattr(model, 'class_names'):
    print("Class names:", model.class_names)
elif hasattr(model, 'class_indices'):
    print("Class indices:", model.class_indices)

# Check the last layer's configuration
print("Last layer config:", model.layers[-1].get_config())
