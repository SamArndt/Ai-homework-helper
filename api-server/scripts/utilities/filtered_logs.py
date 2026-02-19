import logging

class LogFormatter(logging.Formatter):
    COLORS = {
        logging.DEBUG: "\033[94m",
        logging.INFO: "\033[92m",
        logging.WARNING: "\033[93m",
        logging.ERROR: "\033[91m",
        logging.CRITICAL: "\033[95m",
    }

    EMOJIS = {
        logging.DEBUG: "🐞",
        logging.INFO: "ℹ️",
        logging.WARNING: "⚠️",
        logging.ERROR: "❌",
        logging.CRITICAL: "🔥",
    }

    RESET = "\033[0m"

    def format(self, record: logging.LogRecord) -> str:
        color = self.COLORS.get(record.levelno, "")
        emoji = self.EMOJIS.get(record.levelno, "")

        # Let base formatter build the normal message first
        formatted_message = super().format(record)

        # Remove request id from message if no id given
        # Based on format string: "format": " %(asctime)s - %(levelname)-5s [%(name)s] request_id=%(request_id)s, %(levelname)s | %(message)s"
        formatted_message = formatted_message.replace("request_id=,", "")

        # Tint the entire line
        return f"{color}{emoji}  {formatted_message}{self.RESET}"
    

logger = logging.getLogger(__name__)

def log(message):
    logger.debug(message)

def log(message, level=logging.INFO):
    # Process logging based on level
    match(level):
        case logging.DEBUG:
            logger.debug(message)
        case logging.INFO:
            logger.info(message)
        case logging.WARNING:
            logger.warning(message)
        case logging.ERROR:
            logger.error(message)
        case logging.CRITICAL:
            logger.critical(message)
