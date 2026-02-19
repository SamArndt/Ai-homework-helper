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

        # Tint the entire line
        return f"{color}{emoji}  {formatted_message}{self.RESET}"
    

logger = logging.getLogger(__name__)

def log(message):
    logger.debug(message)

def log(message, level=logging.INFO):
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
    
def log(message, request_id=None, level=logging.INFO):
    if request_id:
        log(f"[{request_id}] {message}", level)
    else:
        log(message, level)
